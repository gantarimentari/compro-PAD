<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\ReminderVaksinasi;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    /**
     * ✅ Get upcoming notifications (next 7 days)
     * Route: GET /api/notifications/upcoming
     */
    public function getUpcomingNotifications(Request $request)
    {
        try {
            $now = Carbon::now('Asia/Jakarta');
            $user = $request->user();

            $query = Notification::with(['vaksinasi.hewan.pasien', 'vaksinasi.jenisVaksin'])
                ->where('tipe', 'vaksinasi')
                ->whereIn('status', ['pending', 'success', 'sent'])
                ->whereHas('vaksinasi', function ($q) use ($now) {
                    $q->whereBetween('tanggal_vaksin', [
                        $now->copy()->startOfDay(),
                        $now->copy()->addDays(7)->endOfDay(),
                    ]);
                })
                ->orderBy('created_at', 'desc');

            // Untuk popup user: batasi notifikasi milik user login
            if ($user) {
                $query->where('id_pasien', $user->id);
            } elseif ($request->filled('id_pasien')) {
                // fallback untuk endpoint admin/public bila diperlukan
                $query->where('id_pasien', $request->id_pasien);
            }

            $rows = $query->get();

            $notifications = $rows->map(function ($notif) use ($now) {
                $vaksinasi = $notif->vaksinasi;
                $daysUntil = (int) $now->copy()->startOfDay()
                    ->diffInDays($vaksinasi->tanggal_vaksin, false);

                if ($notif->reminder_type === '3_days_sebelum') {
                    $label = '3 hari lagi';
                } elseif ($notif->reminder_type === '7_day_before' || $notif->reminder_type === '1_day_before') {
                    $label = '7 hari lagi';
                } elseif ($notif->reminder_type === 'same_day') {
                    $label = 'Hari ini';
                } else {
                    $label = "{$daysUntil} hari lagi";
                }

                return [
                    'id_notification' => $notif->id_notification,
                    'id_vaksinasi' => $notif->id_vaksinasi,
                    'id_jenis_vaksin' => $vaksinasi->id_jenis_vaksin,
                    'tanggal_vaksin' => Carbon::parse($vaksinasi->tanggal_vaksin)->format('d/m/Y'),
                    'days_until' => $daysUntil,
                    'reminder_type' => $notif->reminder_type,
                    'label' => $label,
                    'status' => $this->normalizeNotificationStatus($notif->status),
                    'channel' => $notif->channel,
                    'recipient' => $notif->recipient,
                    'nama_hewan' => $vaksinasi->hewan->nama_hewan ?? '-',
                    'nama_vaksin' => $vaksinasi->jenisVaksin->nama_vaksin ?? '-',
                    'nama_pemilik' => $vaksinasi->hewan->pasien->username
                        ?? $vaksinasi->hewan->pasien->name
                        ?? '-',
                ];
            });

            return response()->json([
                'count' => $notifications->count(),
                'notifications' => $notifications,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching upcoming notifications: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch upcoming notifications',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ Get notification history dengan filter
     * Route: GET /api/notifications
    * Query params: ?id_pasien=1&channel=wa&status=success&id_vaksinasi=5
     */
    public function index(Request $request)
    {
        $request->validate([
            'id_pasien' => 'sometimes|integer|exists:users,id',
            'channel' => 'sometimes|in:wa,email',
            'status' => 'sometimes|in:pending,success,failed,sent,gagal',
            'id_vaksinasi' => 'sometimes|integer|exists:reminder_vaksinasi,id_vaksinasi',
            'from_date' => 'sometimes|date',
            'to_date' => 'sometimes|date|after_or_equal:from_date',
            'search' => 'sometimes|string|max:255',
        ]);

        try {
            $query = Notification::with(['vaksinasi.hewan.pasien', 'pasien'])
                ->orderBy('waktu_kirim', 'desc');

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('recipient', 'like', "%${search}%")
                      ->orWhere('tipe', 'like', "%${search}%");
                    
                });
            }
            if ($request->filled('id_pasien')) {
                $query->where('id_pasien', $request->id_pasien);
            }

            if ($request->filled('channel')) {
                $query->where('channel', $request->channel);
            }

            if ($request->filled('status')) {
                $statusFilter = $this->normalizeNotificationStatus($request->status);

                if ($statusFilter === 'success') {
                    $query->whereIn('status', ['success', 'sent']);
                } elseif ($statusFilter === 'failed') {
                    $query->whereIn('status', ['failed', 'gagal']);
                } else {
                    $query->where('status', $statusFilter);
                }
            }

            if ($request->filled('id_vaksinasi')) {
                $query->where('id_vaksinasi', $request->id_vaksinasi);
            }

            if ($request->filled('from_date')) {
                $query->where('waktu_kirim', '>=', $request->from_date);
            }

            if ($request->filled('to_date')) {
                $query->where('waktu_kirim', '<=', $request->to_date);
            }

            $page = $query->paginate(20);
            $page->getCollection()->transform(function ($notif) {
                $notif->status = $this->normalizeNotificationStatus($notif->status);
                return $notif;
            });

            return response()->json($page);
        } catch (\Exception $e) {
            Log::error('Error fetching notifications: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch notifications',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ Get single notification detail
     * Route: GET /api/notifications/{id}
     */
    public function show($id)
    {
        try {
            $notification = Notification::with(['vaksinasi.hewan.pasien', 'pasien'])
                ->findOrFail($id);

            return response()->json($notification);
        } catch (\Exception $e) {
            Log::error('Error fetching notification: ' . $e->getMessage());
            return response()->json([
                'message' => 'Notification not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * ✅ Update notification status
     * Route: PUT /api/notifications/{id}
    * Body: { "status": "success", "error_message": null }
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,success,failed,sent,gagal',
            'error_message' => 'nullable|string',
        ]);

        try {
            $notification = Notification::findOrFail($id);

            $normalizedStatus = $this->normalizeNotificationStatus($validated['status']);

            if ($normalizedStatus === 'success' && !$notification->waktu_kirim) {
                $validated['waktu_kirim'] = now();
            }

            $validated['status'] = $normalizedStatus;

            try {
                $notification->update($validated);
            } catch (QueryException $e) {
                $validated['status'] = $normalizedStatus === 'success'
                    ? 'sent'
                    : ($normalizedStatus === 'failed' ? 'gagal' : $normalizedStatus);
                $notification->update($validated);
            }

            Log::info('Notification updated', [
                'id' => $id,
                'status' => $validated['status'],
            ]);

            return response()->json([
                'message' => 'Notification updated successfully',
                'data' => $notification,
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating notification: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update notification',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ Get notification statistics
     * Route: GET /api/notifications/stats
     */
    public function getStats(Request $request)
    {
        $request->validate([
            'id_pasien' => 'sometimes|integer|exists:users,id',
        ]);

        try {
            $id_pasien = $request->query('id_pasien');
            $query = Notification::query();

            if ($id_pasien) {
                $query->where('id_pasien', $id_pasien);
            }

            $stats = [
                'total_success' => (clone $query)->whereIn('status', ['success', 'sent'])->count(),
                'total_sent' => (clone $query)->whereIn('status', ['success', 'sent'])->count(),
                'total_pending' => (clone $query)->where('status', 'pending')->count(),
                'total_failed' => (clone $query)->whereIn('status', ['failed', 'gagal'])->count(),
                'by_channel' => [
                    'wa' => (clone $query)->where('channel', 'wa')->count(),
                    'email' => (clone $query)->where('channel', 'email')->count(),
                ],
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            Log::error('Error fetching notification stats: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ Get notifications by pasien
     * Route: GET /api/notifications/pasien/{id_pasien}
     */
    public function getByPasien($id_pasien)
    {
        try {
            $notifications = Notification::with(['vaksinasi.hewan', 'pasien'])
                ->where('id_pasien', $id_pasien)
                ->orderBy('waktu_kirim', 'desc')
                ->paginate(20);

            $notifications->getCollection()->transform(function ($notif) {
                $notif->status = $this->normalizeNotificationStatus($notif->status);
                return $notif;
            });

            return response()->json($notifications);
        } catch (\Exception $e) {
            Log::error('Error fetching pasien notifications: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch notifications',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function normalizeNotificationStatus(?string $status): string
    {
        return match ($status) {
            'sent' => 'success',
            'gagal' => 'failed',
            default => $status ?? 'pending',
        };
    }
    // tambah endpoin untuk search 
    
}
