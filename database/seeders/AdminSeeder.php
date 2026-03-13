<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@klinikdrfanina.com'],
            [
                'username' => 'admin',
                'phone_number' => '081234567890',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );
        User::firstOrCreate(
            ['email' => 'andi@klinikfanina.com'],
            [
                'username' => 'andi',
                'phone_number' => '081234567891',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );
        User::firstOrCreate(
            ['email' => 'budi@klinikfanina.com'],
            [
                'username' => 'budi',
                'phone_number' => '081234567892',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );
    }
}
