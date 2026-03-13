<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Hewan;
use App\Models\User;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getStatistics()
    {
        try {
            // Total Hewan (semua hewan di database)
            $totalHewan = Hewan::count();

            // Total Kunjungan (total pasien/users dengan role 'user')
            $totalKunjungan = User::where('role', 'user')->count();

            // Kunjungan Baru (reset tiap minggu - pasien baru dalam 7 hari terakhir)
            $kunjunganBaru = User::where('role', 'user')
                ->where('created_at', '>=', Carbon::now()->startOfWeek())
                ->count();

            // Rekam Medis (total reservasi keseluruhan)
            $rekamMedis = Reservation::count();

            return response()->json([
                'totalHewan' => $totalHewan,
                'totalKunjungan' => $totalKunjungan,
                'kunjunganBaru' => $kunjunganBaru,
                'rekamMedis' => $rekamMedis,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in getStatistics: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getClinicSummary()
    {
        try {
            $currentMonth = Carbon::now()->month;
            $currentYear = Carbon::now()->year;
            $lastMonth = Carbon::now()->subMonth()->month;
            $lastYear = Carbon::now()->subMonth()->year;

            // Konsultasi - PERBAIKAN: gunakan where dengan closure
            $konsultasiCurrent = Reservation::whereMonth('tanggal_reservasi', $currentMonth)
                ->whereYear('tanggal_reservasi', $currentYear)
                ->where(function($query) {
                    $query->where('keluhan', 'like', '%konsultasi%')
                          ->orWhere('keluhan', 'like', '%periksa%');
                })
                ->count();

            $konsultasiLast = Reservation::whereMonth('tanggal_reservasi', $lastMonth)
                ->whereYear('tanggal_reservasi', $lastYear)
                ->where(function($query) {
                    $query->where('keluhan', 'like', '%konsultasi%')
                          ->orWhere('keluhan', 'like', '%periksa%');
                })
                ->count();

            $konsultasiChange = $konsultasiLast > 0 
                ? round((($konsultasiCurrent - $konsultasiLast) / $konsultasiLast) * 100, 1)
                : ($konsultasiCurrent > 0 ? 100 : 0);

            // Rawat Inap - PERBAIKAN: gunakan where dengan closure
            $rawatInapCurrent = Reservation::whereMonth('tanggal_reservasi', $currentMonth)
                ->whereYear('tanggal_reservasi', $currentYear)
                ->where(function($query) {
                    $query->where('keluhan', 'like', '%rawat inap%')
                          ->orWhere('keluhan', 'like', '%dirawat%');
                })
                ->count();

            $rawatInapLast = Reservation::whereMonth('tanggal_reservasi', $lastMonth)
                ->whereYear('tanggal_reservasi', $lastYear)
                ->where(function($query) {
                    $query->where('keluhan', 'like', '%rawat inap%')
                          ->orWhere('keluhan', 'like', '%dirawat%');
                })
                ->count();

            $rawatInapChange = $rawatInapLast > 0 
                ? round((($rawatInapCurrent - $rawatInapLast) / $rawatInapLast) * 100, 1)
                : ($rawatInapCurrent > 0 ? 100 : 0);

            // Pemeriksaan Umum - PERBAIKAN: gunakan where dengan closure
            $pemeriksaanCurrent = Reservation::whereMonth('tanggal_reservasi', $currentMonth)
                ->whereYear('tanggal_reservasi', $currentYear)
                ->where(function($query) {
                    $query->where('keluhan', 'like', '%pemeriksaan%')
                          ->orWhere('keluhan', 'like', '%umum%');
                })
                ->count();

            $pemeriksaanLast = Reservation::whereMonth('tanggal_reservasi', $lastMonth)
                ->whereYear('tanggal_reservasi', $lastYear)
                ->where(function($query) {
                    $query->where('keluhan', 'like', '%pemeriksaan%')
                          ->orWhere('keluhan', 'like', '%umum%');
                })
                ->count();

            $pemeriksaanChange = $pemeriksaanLast > 0 
                ? round((($pemeriksaanCurrent - $pemeriksaanLast) / $pemeriksaanLast) * 100, 1)
                : ($pemeriksaanCurrent > 0 ? 100 : 0);

            // Total Reservasi
            $totalReservasiCurrent = Reservation::whereMonth('tanggal_reservasi', $currentMonth)
                ->whereYear('tanggal_reservasi', $currentYear)
                ->count();
                
            $totalReservasiLast = Reservation::whereMonth('tanggal_reservasi', $lastMonth)
                ->whereYear('tanggal_reservasi', $lastYear)
                ->count();

            $totalReservasiChange = $totalReservasiLast > 0 
                ? round((($totalReservasiCurrent - $totalReservasiLast) / $totalReservasiLast) * 100, 1)
                : ($totalReservasiCurrent > 0 ? 100 : 0);

            return response()->json([
                'konsultasi' => [
                    'count' => $konsultasiCurrent,
                    'change' => abs($konsultasiChange),
                    'isPositive' => $konsultasiChange >= 0,
                ],
                'rawatInap' => [
                    'count' => $rawatInapCurrent,
                    'change' => abs($rawatInapChange),
                    'isPositive' => $rawatInapChange >= 0,
                ],
                'pemeriksaanUmum' => [
                    'count' => $pemeriksaanCurrent,
                    'change' => abs($pemeriksaanChange),
                    'isPositive' => $pemeriksaanChange >= 0,
                ],
                'totalHewanDirawat' => [
                    'count' => $totalReservasiCurrent,
                    'change' => abs($totalReservasiChange),
                    'isPositive' => $totalReservasiChange >= 0,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error in getClinicSummary: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch clinic summary',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getRecentTransactions()
    {
        try {
            // Ambil hewan-hewan terbaru dengan relasi ke pasien
            $transactions = Hewan::with(['pasien', 'jenisHewan'])
                ->orderBy('created_at', 'desc')
                ->take(12)
                ->get()
                ->map(function ($hewan) {
                    return [
                        'id' => $hewan->id_hewan,
                        'petName' => $hewan->nama_hewan ?? 'Tidak ada nama',
                        'animalType' => $hewan->jenisHewan->nama_jenis ?? 'Tidak diketahui',
                        'ownerName' => $hewan->pasien->username ?? 'Tidak diketahui',
                        'date' => Carbon::parse($hewan->created_at)->format('d M, Y'),
                    ];
                });

            return response()->json($transactions);
        } catch (\Exception $e) {
            Log::error('Error in getRecentTransactions: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'error' => 'Failed to fetch transactions',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
