<?php

namespace App\Http\Controllers;

use App\Models\ReminderLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use App\Models\ReminderVaksinasi;
use Illuminate\Support\Facades\Log;
use App\Models\Notification;

class ReminderVaksinasiController extends Controller
{
    public function sendScheduledVaksinasi(){
        try{
            $now = Carbon::now();
            $reminders = [];

            $upcomingVaksinasi = ReminderVaksinasi::with(['hewan.pasien', 'jenisVaksin'])
                ->whereBetween('tanggal_vaksin', [
                    $now->copy()->startOfDay(),
                    $now->copy()->addDays(7)->endOfDay()
                ])
                ->get();
            
            Log::info('checking vacctination reminders',[
                'date'=>$now->format('Y-m-d'),
                'found'=>$upcomingVaksinasi->count()
            ]);

            foreach ($upcomingVaksinasi as $vaksinasi){
                $daysUntil = $now->startOfDay()->diffInDays($vaksinasi->tanggal_vaksin, false);

                $reminderType = null;
                if($daysUntil==3){
                    $reminderType = '3_days_sebelum';
                } elseif ($daysUntil==7){
                    $reminderType = '7_day_before';
                } elseif ($daysUntil==0){
                    $reminderType = 'same_day';
                }
                if(!$reminderType)continue;

                $logReminderType = $this->normalizeReminderTypeForLog($reminderType);

                $alreadySent = ReminderLog::where('id_vaksinasi', $vaksinasi->id_vaksinasi)
                    ->where('reminder_type', $logReminderType)
                    ->where('status', 'sent')
                    ->exists();
                
                if($alreadySent){
                    Log::info('reminder already sent', [
                        'id_vaksinasi'=> $vaksinasi->id_vaksinasi,
                        'type'=> $reminderType
                    ]);
                    continue;
                }

                $sent = $this->sendWhatsAppReminder($vaksinasi, $reminderType);

                if($sent){
                    ReminderLog::create([
                        'id_vaksinasi'=>$vaksinasi->id_vaksinasi,
                        'reminder_type'=>$logReminderType,
                        'sent_at'=> now(),
                        'status'=>'sent',
                        'phone_number'=> $vaksinasi->hewan->pasien->phone_number ?? null,
                    ]);

                    Notification::create([
                        'id_vaksinasi' => $vaksinasi->id_vaksinasi,
                        'id_pasien' => $vaksinasi->id_pasien,
                        'recipient' => $vaksinasi->hewan->pasien->phone_number ?? 'N/A',
                        'channel' => 'wa',
                        'waktu_kirim' => now(),
                        'tipe' => 'vaksinasi',
                        'status' => 'sent',
                        'reminder_type' => $reminderType,
                        'error_message' => null,             
                    ]);

                    if($reminderType === 'same_day'){
                        $interval = $vaksinasi->jenisVaksin->interval ?? null;
                        if($interval){
                            ReminderVaksinasi::create([
                                'id_hewan'        => $vaksinasi->id_hewan,
                                'id_pasien'       => $vaksinasi->id_pasien,
                                'id_jenis_vaksin' => $vaksinasi->id_jenis_vaksin,
                                'tanggal_vaksin'  => Carbon::parse($vaksinasi->tanggal_vaksin)
                                                        ->addMonths($interval)->toDateString(),
                            ]);
                        }
                    }

                    $reminders[] = [
                        'id_vaksinasi' => $vaksinasi->id_vaksinasi,
                        'nama_vaksin' => $vaksinasi->jenisVaksin->nama_vaksin ?? '-',
                        'type' => $reminderType,
                        'sent_to' => $vaksinasi->hewan->pasien->phone_number ?? 'N/A',
                    ];
                }
            }
            Log::info('✅ Vaccination reminders sent', [
                'count' => count($reminders)
            ]);

            return response()->json([
                'message' => 'Vaccination reminders sent successfully',
                'sent_count' => count($reminders),
                'details' => $reminders
            ]);
        } catch(\Exception $e){
            Log::error('error sending vaccination reinders: ' . $e->getMessage());
            return response()->json([
                'message'=>'failed to send reminders',
                'error'=> $e->getMessage()
            ], 500);        
        }
    }

    private function sendWhatsAppReminder($vaksinasi, $reminderType){
        try{
            $pasien = $vaksinasi->hewan->pasien;

            if(!$pasien || !$pasien->phone_number){
                Log::warning('no phone number found', [
                    'id_vaksinasi'=> $vaksinasi->id_vaksinasi,
                    'hewan_id'=> $vaksinasi->id_hewan
                ]);
                return false;
            }
            $phoneNumber = $this->formatPhoneNumber($pasien->phone_number);
            if(!$phoneNumber){
                Log::warning('invalid phone number', [
                    'id_vaksinasi'=>$vaksinasi->id_vaksinasi,
                    'phone'=>$pasien->phone_number
                ]);
                return false;
            }

            $message = $this->generateMessage($vaksinasi, $reminderType);

            $response = Http::withHeaders([
                'apikey'=> env('WHATSAPP_TOKEN'),
                'Content-Type'=> 'application/json',
            ])->post(env('WHATSAPP_API_URL'), [
                'number'=>$phoneNumber,
                'text'=>$message,            
            ]);

            if($response->successful()){
                Log::info('whatsapp sent', [
                    'id_vaksinasi'=> $vaksinasi->id_vaksinasi,
                    'number'=> $phoneNumber,
                    'text'=> $reminderType
                ]);
                return true;
            }else{
                Log::error('whatsapp api failed', [
                    'status'=> $response->status(),
                    'body'=>$response->body()
                ]);
                return false;
            }
        } catch(\Exception $e){
            Log::error('error sending whatsapp: ' . $e->getMessage());
            return false;    
        }
    }

    private function generateMessage($vaksinasi, $reminderType)
    {
        $petName = $vaksinasi->hewan->nama_hewan ?? 'Hewan Anda';
        $ownerName = $vaksinasi->hewan->pasien->name ?? $vaksinasi->hewan->pasien->username ?? 'Pemilik';
        $jenisVaksin = $vaksinasi->jenisVaksin->nama_vaksin ?? '-';
        $date = Carbon::parse($vaksinasi->tanggal_vaksin)->format('d/m/Y');

        $messages = [
            '3_days_sebelum' => "💉 *Reminder Vaksinasi*\n\n" .
                "Halo {$ownerName}! 👋\n\n" .
                "Ini adalah pengingat bahwa {$petName} memiliki jadwal vaksinasi *{$jenisVaksin}* dalam *3 hari*.\n\n" .
                "📅 Tanggal: {$date}\n" .
                "🐾 Hewan: {$petName}\n" .
                "💉 Jenis Vaksin: {$jenisVaksin}\n\n" .
                "Jangan lupa untuk datang ya! Kesehatan hewan peliharaan Anda adalah prioritas kami. 🏥❤️",

            '7_day_before' => "💉 *Reminder Vaksinasi*\n\n" .
                "Halo {$ownerName}! 👋\n\n" .
                "Ini adalah pengingat bahwa {$petName} memiliki jadwal vaksinasi *{$jenisVaksin}* dalam *7 hari*.\n\n" .
                "📅 Tanggal: {$date}\n" .
                "🐾 Hewan: {$petName}\n" .
                "💉 Jenis Vaksin: {$jenisVaksin}\n\n" .
                "Pastikan {$petName} dalam kondisi sehat dan tidak sedang sakit ya! 🙏",

            'same_day' => "💉 *Reminder Vaksinasi*\n\n" .
                "Halo {$ownerName}! 👋\n\n" .
                "Ini adalah pengingat bahwa {$petName} memiliki jadwal vaksinasi *{$jenisVaksin}* *hari ini*.\n\n" .
                "🐾 Hewan: {$petName}\n" .
                "💉 Jenis Vaksin: {$jenisVaksin}\n\n" .
                "Kami tunggu kedatangan Anda di klinik! Sampai jumpa! 🏥✨",
        ];

        return $messages[$reminderType] ?? $messages['7_day_before'];
    }

        private function formatPhoneNumber($phone)
    {
        // Remove spaces, dashes, and other characters
        $phone = preg_replace('/[^0-9]/', '', $phone);

        // Convert 08xx to 628xx
        if (substr($phone, 0, 1) === '0') {
            $phone = '62' . substr($phone, 1);
        }

        // Validate length
        if (strlen($phone) < 10 || strlen($phone) > 15) {
            return null;
        }

        return $phone;
    }

    /**
     * ✅ Manual trigger reminder (untuk testing)
     */
    public function sendManualReminder(Request $request)
    {
        $validated = $request->validate([
            'id_vaksinasi' => 'required|exists:reminder_vaksinasi,id_vaksinasi',
            'reminder_type' => 'required|in:7_day_before,3_days_sebelum,same_day',
        ]);

        try {
            $vaksinasi = ReminderVaksinasi::with(['hewan.pasien', 'jenisVaksin'])
                ->findOrFail($validated['id_vaksinasi']);

            $logReminderType = $this->normalizeReminderTypeForLog($validated['reminder_type']);

            $alreadySent = ReminderLog::where('id_vaksinasi', $vaksinasi->id_vaksinasi)
                ->where('status', 'sent')
                ->where('is_manual', true)
                ->exists();

            if ($alreadySent) {
                return response()->json([
                    'message' => 'Reminder untuk jadwal ini sudah dikirim',
                    'error' => 'reminder_already_sent'
                ], 409);
            }

            $sent = $this->sendWhatsAppReminder($vaksinasi, $validated['reminder_type']);

            if ($sent) {
                ReminderLog::updateOrCreate(
                    [
                        'id_vaksinasi' => $vaksinasi->id_vaksinasi,
                        'reminder_type' => $logReminderType,
                    ],
                    [
                        'sent_at' => now(),
                        'status' => 'sent',
                        'phone_number' => $vaksinasi->hewan->pasien->phone_number ?? null,
                        'is_manual' => true,
                        'error_message' => null,
                    ]
                );

                return response()->json([
                    'message' => 'Reminder sent successfully',
                    'id_vaksinasi' => $vaksinasi->id_vaksinasi,
                    'reminder_sent' => true,
                ]);
            } else {
                return response()->json([
                    'message' => 'Failed to send reminder'
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Error sending manual reminder: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to send reminder',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Get reminder logs
     */
    public function getReminderLogs(Request $request)
    {
        try {
            $query = ReminderLog::with(['vaksinasi.hewan.pasien'])
                ->orderBy('sent_at', 'desc');

            if ($request->has('id_vaksinasi')) {
                $query->where('id_vaksinasi', $request->id_vaksinasi);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $logs = $query->paginate(20);

            return response()->json($logs);

        } catch (\Exception $e) {
            Log::error('Error fetching reminder logs: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ CRUD Methods untuk Reminder Vaksinasi
     */

    // Get all vaccination reminders
    public function index(Request $request)
    {
        try {
            $query = ReminderVaksinasi::with(['hewan.pasien']);

            // Filter by hewan
            if ($request->has('id_hewan')) {
                $query->where('id_hewan', $request->id_hewan);
            }

            // Filter by date range
            if ($request->has('from_date')) {
                $query->where('tanggal_vaksin', '>=', $request->from_date);
            }

            if ($request->has('to_date')) {
                $query->where('tanggal_vaksin', '<=', $request->to_date);
            }

            // Order by date
            $vaksinasi = $query->orderBy('tanggal_vaksin', 'asc')->get();
            $sentReminderIds = ReminderLog::query()
                ->whereIn('id_vaksinasi', $vaksinasi->pluck('id_vaksinasi'))
                ->where('status', 'sent')
                ->where('is_manual', true)
                ->pluck('id_vaksinasi')
                ->map(fn ($id) => (string) $id)
                ->flip();

            $payload = $vaksinasi->map(function ($item) use ($sentReminderIds) {
                $row = $item->toArray();
                $row['reminder_sent'] = $sentReminderIds->has((string) ($item->id_vaksinasi ?? ''));
                return $row;
            });

            return response()->json($payload);

        } catch (\Exception $e) {
            Log::error('Error fetching vaksinasi: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch vaksinasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Create new vaccination reminder
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_hewan' => 'required|exists:hewan,id_hewan',
            'dilakukan_oleh'=>'required|string|max:255',
            'id_jenis_vaksin' => 'required|integer|exists:jenis_vaksin,id_vaksinasi',
            'tanggal_vaksin' => 'required|date|after_or_equal:today',
            'catatan'=> 'nullable|string|max:100',
        ]);

        try {
            $hewan = \App\Models\Hewan::findOrFail($validated['id_hewan']);
            $validated['id_pasien'] = $hewan->id_pasien;

            $vaksinasi = ReminderVaksinasi::create($validated);

            Log::info('✅ Vaksinasi reminder created', [
                'id' => $vaksinasi->id_vaksinasi,
                'hewan' => $validated['id_hewan'],
                'jenis_vaksin'=>$validated['id_jenis_vaksin'],
                'tanggal'=>$validated['tanggal_vaksin'],
                'oleh'=>$validated['dilakukan_oleh'],
            ]);

            return response()->json([
                'message' => 'Vaccination reminder created successfully',
                'data' => $vaksinasi->load('hewan.pasien', 'jenisVaksin'),
                'vaccination_stats' => [
                    'total_scheduled' => ReminderVaksinasi::where('id_hewan', $hewan->id_hewan)->count(),
                    'completed' => ReminderVaksinasi::where('id_hewan', $hewan->id_hewan)
                        ->where('status', 'Selesai')->count(),
                    'upcoming' => ReminderVaksinasi::where('id_hewan', $hewan->id_hewan)
                        ->where('status', 'Dijadwalkan')
                        ->where('tanggal_vaksin', '>', now())
                        ->count(),
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating vaksinasi: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create vaksinasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Update vaccination reminder
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'id_hewan' => 'sometimes|exists:hewan,id_hewan',
            'id_jenis_vaksin' => 'sometimes|integer|exists:jenis_vaksin,id_vaksinasi',
            'tanggal_vaksin' => 'sometimes|date|after_or_equal:today',
            'status' => 'sometimes|string|in:Selesai,Dijadwalkan,Terkirim,Terlewat',
            'tanggal_vaksin_aktual' => 'sometimes|nullable|date',
            'dilakukan_oleh' => 'sometimes|nullable|string|max:255',
            'catatan' => 'sometimes|nullable|string',
            'jadwal_vaksin_berikutnya' => 'sometimes|nullable|date',
            'tipe_jadwal' => 'sometimes|nullable|string|in:automatic,manual,final',
        ]);

        if (($validated['tipe_jadwal'] ?? null) === 'final') {
            $validated['status'] = 'Selesai';
            $validated['jadwal_vaksin_berikutnya'] = null;
        }

        try {
            $vaksinasi = ReminderVaksinasi::with(['hewan', 'jenisVaksin'])
                ->findOrFail($id);


            if (isset($validated['tipe_jadwal']) && $validated['tipe_jadwal'] !== null) {
                if ($validated['tipe_jadwal'] === 'final') {
                    $validated['status'] = 'Selesai';
                    $validated['jadwal_vaksin_berikutnya'] = null;
                    
                    Log::info('Vaksinasi marked as FINAL (no booster needed)', [
                        'id_vaksinasi' => $id,
                        'nama_vaksin' => $vaksinasi->jenisVaksin->nama_vaksin ?? '-',
                        'hewan_id' => $vaksinasi->id_hewan
                    ]);
                }
                
                else if (in_array($validated['tipe_jadwal'], ['automatic', 'manual'])) {
                    $validated['status'] = 'Dijadwalkan';
                    
                    if (!isset($validated['tanggal_vaksin_aktual']) || 
                        is_null($validated['tanggal_vaksin_aktual'])) {
                        return response()->json([
                            'message' => 'Tanggal vaksin aktual harus diisi',
                            'error' => 'tanggal_vaksin_aktual_required'
                        ], 422);
                    }
                    
                    $tanggalAktual = Carbon::parse($validated['tanggal_vaksin_aktual']);
                    $nextVaksinDate = null;
                    
                    if ($validated['tipe_jadwal'] === 'automatic') {
                        $interval = $vaksinasi->jenisVaksin->interval ?? 12;
                        $nextVaksinDate = $tanggalAktual->copy()->addMonths($interval);
                        $validated['jadwal_vaksin_berikutnya'] = $nextVaksinDate->format('Y-m-d');
                        
                        Log::info('✅ Vaksinasi marked as AUTOMATIC', [
                            'id_vaksinasi' => $id,
                            'interval_bulan' => $interval,
                            'next_schedule' => $nextVaksinDate->format('Y-m-d'),
                            'oleh' => $validated['dilakukan_oleh'] ?? 'N/A'
                        ]);
                    }
                    
                    else if ($validated['tipe_jadwal'] === 'manual') {
                        
                        if (!isset($validated['jadwal_vaksin_berikutnya']) || 
                            is_null($validated['jadwal_vaksin_berikutnya'])) {
                            return response()->json([
                                'message' => 'Tanggal vaksin berikutnya harus diisi untuk manual scheduling',
                                'error' => 'jadwal_vaksin_berikutnya_required'
                            ], 422);
                        }
                        
                        $nextVaksinDate = Carbon::parse($validated['jadwal_vaksin_berikutnya']);
                        
                        Log::info('✅ Vaksinasi marked as MANUAL with custom date', [
                            'id_vaksinasi' => $id,
                            'custom_next_date' => $nextVaksinDate->format('Y-m-d'),
                            'oleh' => $validated['dilakukan_oleh'] ?? 'N/A'
                        ]);
                    }
                    
                    if ($nextVaksinDate) {
                        try {
                            ReminderVaksinasi::create([
                                'id_hewan' => $vaksinasi->id_hewan,
                                'id_pasien' => $vaksinasi->id_pasien,
                                'id_jenis_vaksin' => $vaksinasi->id_jenis_vaksin,
                                'tanggal_vaksin' => $nextVaksinDate->format('Y-m-d'),
                                'status' => 'Dijadwalkan',
                            ]);
                            
                            Log::info('✅ Next reminder vaksinasi created', [
                                'id_hewan' => $vaksinasi->id_hewan,
                                'tanggal_vaksin' => $nextVaksinDate->format('Y-m-d'),
                                'jenis_vaksin' => $vaksinasi->jenisVaksin->nama_vaksin ?? '-'
                            ]);
                        } catch (\Exception $e) {
                            Log::error('Error creating next reminder vaksinasi: ' . $e->getMessage());
                            // Jangan return error, vaksinasi current tetap ter-update
                        }
                    }
                }
            }

            $vaksinasi->update($validated);

            $stats = [
                'total_scheduled' => ReminderVaksinasi::where('id_hewan', $vaksinasi->id_hewan)->count(),
                'completed' => ReminderVaksinasi::where('id_hewan', $vaksinasi->id_hewan)
                    ->where('status', 'Selesai')->count(),
                'upcoming' => ReminderVaksinasi::where('id_hewan', $vaksinasi->id_hewan)
                    ->where('status', 'Dijadwalkan')
                    ->where('tanggal_vaksin', '>', now())
                    ->count(),
                'overdue' => ReminderVaksinasi::where('id_hewan', $vaksinasi->id_hewan)
                    ->where('status', 'Dijadwalkan')
                    ->where('tanggal_vaksin', '<', now())
                    ->count(),
            ];

            Log::info('✅ Vaksinasi reminder updated successfully', ['id' => $id]);

            return response()->json([
                'message' => 'Vaccination reminder updated successfully',
                'data' => $vaksinasi->load('hewan.pasien', 'jenisVaksin'),
                'vaccination_stats' => $stats,
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating vaksinasi: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update vaksinasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Delete vaccination reminder
    public function destroy($id)
    {
        try {
            $vaksinasi = ReminderVaksinasi::findOrFail($id);
            $vaksinasi->delete();

            Log::info('✅ Vaksinasi reminder deleted', ['id' => $id]);

            return response()->json([
                'message' => 'Vaccination reminder deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting vaksinasi: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete vaksinasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function normalizeReminderTypeForLog(string $reminderType): string
    {
        // Keep DB enum compatibility with existing schema in reminder_log.
        if ($reminderType === '7_day_before') {
            return '1_day_before';
        }

        return $reminderType;
    }

}