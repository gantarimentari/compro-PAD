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
        $this->command->info('═══════════════════════════════════════════════');
        $this->command->info('Reminder Vaksinasi Test Seeder (H-8, H-7, H-0)');
        $this->command->info('═══════════════════════════════════════════════');
        $this->command->newLine();

        // Create patient
        $patient = User::firstOrCreate(
            ['email' => 'patientarasaasdsd@test.com'],
            [
                'username' => 'john_doesdasddasdda',
                'phone_number' => '081316965533',
                'password' => Hash::make('password123'),
                'role' => 'user',
            ]
        );
        $this->command->info("✓ Patient: ID={$patient->id}, {$patient->username}");

        // Create jenis hewan
        $jenisHewan = JenisHewan::firstOrCreate(
            [
                'nama_jenis' => 'Kucing',
                'id_pasien' => $patient->id,
            ]
        );
        $this->command->info("✓ Jenis Hewan: {$jenisHewan->nama_jenis}");

        // Create hewan - FIX: Use id_jenisHewan (camelCase) and tanggal_lahir_hewan
        $hewan = Hewan::firstOrCreate(
            [
                'id_pasien' => $patient->id,
                'nama_hewan' => 'Buddys',
            ],
            [
                'id_jenisHewan' => $jenisHewan->id_jenisHewan,
                'tanggal_lahir_hewan' => '2020-01-15',
            ]
        );
        $this->command->info("✓ Hewan: {$hewan->nama_hewan}");
        $this->command->newLine();

        // Create jenis vaksin
        $jenisVaksinMap = [];
        foreach (['Rabies', 'Parvo', 'Distemper'] as $namaVaksin) {
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

        // Create test reminders with explicit days
        $testCases = [
            [
                'label' => 'H-8 (SHOULD BE REJECTED with 422)',
                'nama_vaksin' => 'Rabies',
                'days' => 12,
                'reminder_type' => '7_day_before',  // Wrong type for H-8
                'expected_status' => '❌ 422 invalid_reminder_day',
            ],
            [
                'label' => 'H-7 (SHOULD BE ACCEPTED with 200)',
                'nama_vaksin' => 'Parvo',
                'days' => 7,
                'reminder_type' => '7_day_before',  // Correct type for H-7
                'expected_status' => '✅ 200 Success',
            ],
            [
                'label' => 'H-0 (SHOULD BE ACCEPTED with 200)',
                'nama_vaksin' => 'Distemper',
                'days' => 0,
                'reminder_type' => 'same_day',  // Correct type for H-0
                'expected_status' => '✅ 200 Success',
            ],
        ];

        $this->command->info('Creating Test Vaccination Reminders:');
        $this->command->newLine();

        $reminders = [];
        foreach ($testCases as $testCase) {
            $tanggalVaksin = Carbon::now()->addDays($testCase['days']);
            
            $reminder = ReminderVaksinasi::firstOrCreate(
                [
                    'id_pasien' => $patient->id,
                    'id_hewan' => $hewan->id_hewan,
                    'id_jenis_vaksin' => $jenisVaksinMap[$testCase['nama_vaksin']],
                    'tanggal_vaksin' => $tanggalVaksin->toDateString(),
                ],
                [
                    'status' => 'Dijadwalkan',
                ]
            );

            $reminders[] = $reminder;

            $this->command->line("  {$testCase['label']}");
            $this->command->line("    ID: {$reminder->id_vaksinasi}");
            $this->command->line("    Vaksin: {$testCase['nama_vaksin']}");
            $this->command->line("    Tanggal: {$tanggalVaksin->format('Y-m-d')} (H-{$testCase['days']})");
            $this->command->line("    Tipe: {$testCase['reminder_type']}");
            $this->command->line("    Expected: {$testCase['expected_status']}");
            $this->command->newLine();
        }

        // Display testing instructions
        $this->command->newLine();
        $this->command->info('═══════════════════════════════════════════════');
        $this->command->info('TESTING INSTRUCTIONS (Manual Reminder Endpoint):');
        $this->command->info('═══════════════════════════════════════════════');
        $this->command->newLine();

        $this->command->line('🧪 Test H-8 (Should REJECT with 422):');
        $this->command->line("   curl -X POST http://localhost:8000/api/reminder-vaksinasi/send-manual \\");
        $this->command->line("     -H \"Content-Type: application/json\" \\");
        $this->command->line("     -d '{\"id_vaksinasi\":{$reminders[0]->id_vaksinasi},\"reminder_type\":\"7_day_before\"}'");
        $this->command->newLine();

        $this->command->line('✅ Test H-7 (Should ACCEPT with 200):');
        $this->command->line("   curl -X POST http://localhost:8000/api/reminder-vaksinasi/send-manual \\");
        $this->command->line("     -H \"Content-Type: application/json\" \\");
        $this->command->line("     -d '{\"id_vaksinasi\":{$reminders[1]->id_vaksinasi},\"reminder_type\":\"7_day_before\"}'");
        $this->command->newLine();

        $this->command->line('✅ Test H-0 (Should ACCEPT with 200):');
        $this->command->line("   curl -X POST http://localhost:8000/api/reminder-vaksinasi/send-manual \\");
        $this->command->line("     -H \"Content-Type: application/json\" \\");
        $this->command->line("     -d '{\"id_vaksinasi\":{$reminders[2]->id_vaksinasi},\"reminder_type\":\"same_day\"}'");
        $this->command->newLine();

        $this->command->info('═══════════════════════════════════════════════');
        $this->command->info('Seeder completed successfully! ✓');
        $this->command->info('═══════════════════════════════════════════════');
    }
}