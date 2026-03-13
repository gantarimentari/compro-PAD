<?php
// database/seeders/ReminderVaksinasiSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\JenisHewan;
use App\Models\Hewan;
use App\Models\ReminderVaksinasi;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class ReminderVaksinasiSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🔄 Starting seeder...');

        $this->command->info('👤 Creating patient user...');
        
        $patient = User::firstOrCreate(
            ['email' => 'patient@test.com'],
            [
                'username' => 'john_doe',
                'phone_number' => '081234567890',
                'password' => Hash::make('password123'),
                'role' => 'user',
            ]
        );

        $this->command->info("✅ Patient created: ID={$patient->id}, Email={$patient->email}");

        $this->command->info('🐕 Creating jenis hewan...');
        
        $jenisHewan = JenisHewan::firstOrCreate(
            [
                'nama_jenis' => 'Anjing',
                'id_pasien' => $patient->id,
            ]
        );

        $this->command->info("✅ Jenis Hewan created: ID={$jenisHewan->id_jenisHewan}, Nama={$jenisHewan->nama_jenis}");

        $this->command->info('🐾 Creating hewan...');
        
        $hewan = Hewan::firstOrCreate(
            [
                'id_pasien' => $patient->id,
                'nama_hewan' => 'Buddy'
            ],
            [
                'id_jenisHewan' => $jenisHewan->id_jenisHewan,
                'tanggal_lahir_hewan' => '2020-01-15',
            ]
        );

        $this->command->info("✅ Hewan created: ID={$hewan->id_hewan}, Nama={$hewan->nama_hewan}");

        $this->command->info('💉 Creating vaccination reminders...');
        
        $vaccinations = [
            [
                'jenis_vaksin' => 'Rabies',
                'tanggal_vaksin' => Carbon::now()->addDays(3), // H-3
            ],
            [
                'jenis_vaksin' => 'Parvo',
                'tanggal_vaksin' => Carbon::now()->addDays(1), // H-1
            ],
            [
                'jenis_vaksin' => 'Distemper',
                'tanggal_vaksin' => Carbon::now(), // H-0 (hari ini)
            ],
        ];

        $createdCount = 0;
        foreach ($vaccinations as $vaccination) {
            $reminder = ReminderVaksinasi::create([
                'id_pasien' => $patient->id,
                'id_hewan' => $hewan->id_hewan,
                'jenis_vaksin' => $vaccination['jenis_vaksin'],
                'tanggal_vaksin' => $vaccination['tanggal_vaksin'],
            ]);
            
            $createdCount++;
            $this->command->info("  ✓ {$reminder->jenis_vaksin} - {$reminder->tanggal_vaksin->format('Y-m-d')}");
        }


        $this->command->newLine();
        $this->command->info('═══════════════════════════════════════');
        $this->command->info('✅ Seeder Completed Successfully!');
        $this->command->info('═══════════════════════════════════════');
        $this->command->table(
            ['Resource', 'Count', 'Details'],
            [
                ['Users (Patient)', '1', "ID: {$patient->id}, Email: {$patient->email}"],
                ['Jenis Hewan', '1', "ID: {$jenisHewan->id_jenisHewan}, Nama: {$jenisHewan->nama_jenis}"],
                ['Hewan', '1', "ID: {$hewan->id_hewan}, Nama: {$hewan->nama_hewan}"],
                ['Vaccination Reminders', $createdCount, 'Rabies, Parvo, Distemper'],
            ]
        );
    }
}