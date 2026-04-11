<?php
// database/seeders/ReminderVaksinasiSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\JenisHewan;
use App\Models\Hewan;
use App\Models\JenisVaksin;
use App\Models\ReminderVaksinasi;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class ReminderVaksinasiSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('═══════════════════════════════════════════════════════════════');
        $this->command->info('🐾 Reminder Vaksinasi Seeder - LENGKAP');
        $this->command->info('═══════════════════════════════════════════════════════════════');
        $this->command->newLine();

        // 1. CREATE PATIENT
        $patient = User::firstOrCreate(
            ['email' => 'rakaiahmadmaulana@gmail.com'],
            [
                'username' => 'frengki',
                'phone_number' => '081316965533',
                'password' => Hash::make('password123'),
                'role' => 'user',
            ]
        );
        $this->command->info("✓ Patient: ID={$patient->id}, {$patient->username}");

        // 2. CREATE JENIS HEWAN
        $jenisHewan = JenisHewan::firstOrCreate(
            [
                'nama_jenis' => 'si manis',
                'id_pasien' => $patient->id,
            ]
        );
        $this->command->info("✓ Jenis Hewan: {$jenisHewan->nama_jenis}");

        // 3. CREATE HEWAN
        $hewan = Hewan::firstOrCreate(
            [
                'id_pasien' => $patient->id,
                'nama_hewan' => 'hitam',
            ],
            [
                'id_jenisHewan' => $jenisHewan->id_jenisHewan,
                'tanggal_lahir_hewan' => '2020-01-15',
            ]
        );
        $this->command->info("✓ Hewan: {$hewan->nama_hewan}");
        $this->command->newLine();

        // 4. CREATE JENIS VAKSIN
        $jenisVaksinMap = [];
        foreach (['Rabies', 'Parvo', 'Distemper', 'FVRCP', 'Leukemia'] as $namaVaksin) {
            $jenis = JenisVaksin::firstOrCreate(
                ['nama_vaksin' => $namaVaksin],
                [
                    'interval' => 12,
                    'deskripsi' => "Vaksin {$namaVaksin}",
                    'efek_samping' => 'Tidak ada efek samping serius yang umum',
                    'status' => 'active',
                ]
            );
            $jenisVaksinMap[$namaVaksin] = $jenis->id_vaksinasi;
        }
        $this->command->info("✓ Jenis Vaksin: " . implode(', ', array_keys($jenisVaksinMap)));
        $this->command->newLine();

        // ═══════════════════════════════════════════════════════════════
        // SECTION 1: REMINDER YANG SUDAH SELESAI (lengkap semua field)
        // ═══════════════════════════════════════════════════════════════
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('✅ REMINDERS COMPLETED (Selesai - Semua Field Terisi)');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->newLine();

        $completedVaksinasi = [
            [
                'nama_vaksin' => 'Rabies',
                'tanggal_vaksin' => '2026-04-09',
                'tanggal_vaksin_aktual' => '2026-04-09',
                'dilakukan_oleh' => 'Dr. Budi Santoso, SpA',
                'catatan' => 'Vaksinasi berjalan lancar, kondisi hewan sehat, reaksi normal',
                'jadwal_vaksin_berikutnya' => '2027-04-13',
                'tipe_jadwal' => 'automatic',
            ],
            [
                'nama_vaksin' => 'Parvo',
                'tanggal_vaksin' => '2026-04-09',
                'tanggal_vaksin_aktual' => '2026-04-09',
                'dilakukan_oleh' => 'Dr. Ani Wijaya, DVM',
                'catatan' => 'Vaksinasi sukses, hewan aktif setelah vaksinasi',
                'jadwal_vaksin_berikutnya' => '2027-04-13',
                'tipe_jadwal' => 'automatic',
            ],
            [
                'nama_vaksin' => 'Distemper',
                'tanggal_vaksin' => '2026-04-09',
                'tanggal_vaksin_aktual' => '2026-04-09',
                'dilakukan_oleh' => 'Dr. Rizky Hermawan, SpVet',
                'catatan' => 'Vaksinasi OK, jadwal booster disarankan 6 bulan',
                'jadwal_vaksin_berikutnya' => '2026-04-13',
                'tipe_jadwal' => 'manual',
            ],
            [
                'nama_vaksin' => 'FVRCP',
                'tanggal_vaksin' => '2026-04-09',
                'tanggal_vaksin_aktual' => '2026-04-09',
                'dilakukan_oleh' => 'Dr. Siti Nurhaliza, SVD',
                'catatan' => 'Vaksinasi berhasil, hewan sehat, tidak ada pembengkakan',
                'jadwal_vaksin_berikutnya' => '2027-04-10',
                'tipe_jadwal' => 'automatic',
            ],
            [
                'nama_vaksin' => 'Leukemia',
                'tanggal_vaksin' => '2026-04-09',
                'tanggal_vaksin_aktual' => '2026-04-09',
                'dilakukan_oleh' => 'Dr. Bambang Irawan, Vet.Med',
                'catatan' => 'Vaksinasi FINAL - tidak perlu booster lagi',
                'jadwal_vaksin_berikutnya' => null,
                'tipe_jadwal' => 'final',
            ],
        ];

        foreach ($completedVaksinasi as $idx => $data) {
            $reminder = ReminderVaksinasi::firstOrCreate(
                [
                    'id_pasien' => $patient->id,
                    'id_hewan' => $hewan->id_hewan,
                    'id_jenis_vaksin' => $jenisVaksinMap[$data['nama_vaksin']],
                    'tanggal_vaksin' => $data['tanggal_vaksin'],
                ],
                [
                    'status' => 'Dijadwalkan',
                    'tanggal_vaksin_aktual' => $data['tanggal_vaksin_aktual'],
                    'dilakukan_oleh' => $data['dilakukan_oleh'],
                    'catatan' => $data['catatan'],
                    'jadwal_vaksin_berikutnya' => $data['jadwal_vaksin_berikutnya'],
                    'tipe_jadwal' => $data['tipe_jadwal'],
                ]
            );

            $no = $idx + 1;
            $this->command->line("[$no] {$data['nama_vaksin']}");
            $this->command->line("    ID: {$reminder->id_vaksinasi} | Status: ✅ Selesai");
            $this->command->line("    Tanggal Jadwal: {$data['tanggal_vaksin']} | Tanggal Aktual: {$data['tanggal_vaksin_aktual']}");
            $this->command->line("    Dilakukan oleh: {$data['dilakukan_oleh']}");
            $this->command->line("    Catatan: {$data['catatan']}");
            $jadwalBerikutnya = $data['jadwal_vaksin_berikutnya'] ?? 'Tidak ada (Final)';
            $this->command->line("    Jadwal Berikutnya: {$jadwalBerikutnya}");
            $this->command->line("    Tipe Jadwal: {$data['tipe_jadwal']}");
            $this->command->newLine();
        }

        // ═══════════════════════════════════════════════════════════════
        // SUMMARY
        // ═══════════════════════════════════════════════════════════════
        $this->command->newLine();
        $this->command->info('═══════════════════════════════════════════════════════════════');
        $this->command->info('📊 SEEDER SUMMARY');
        $this->command->info('═══════════════════════════════════════════════════════════════');
        $this->command->newLine();

        $totalReminders = ReminderVaksinasi::where('id_hewan', $hewan->id_hewan)->count();
        $completedCount = ReminderVaksinasi::where('id_hewan', $hewan->id_hewan)->where('status', 'Selesai')->count();

        $this->command->line("Total Reminders: {$totalReminders}");
        $this->command->line("  ✅ Selesai: {$completedCount}");
        $this->command->newLine();

        $this->command->info('═══════════════════════════════════════════════════════════════');
        $this->command->info('✅ Seeder completed successfully!');
        $this->command->info('═══════════════════════════════════════════════════════════════');
        $this->command->newLine();

        $this->command->line('📝 Cek data di tinker:');
        $this->command->line('   php artisan tinker');
        $this->command->line('   App\Models\ReminderVaksinasi::where("id_hewan", ' . $hewan->id_hewan . ')->get();');
        $this->command->newLine();
    }
}