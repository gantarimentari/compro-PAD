<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SystemInfo;
use App\Models\SocialMedia;

class SystemInfoSeeder extends Seeder
{
    public function run(): void
    {
        // Create default system info
        SystemInfo::create([
            'clinic_name' => 'Klinik Dokter Hewan Fanina',
            'address' => 'Jl Bedoet No.74, Mangunan, Caturharjo, Kec. Sleman, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55515',
            'phone' => '08123456789',
            'email' => 'klinikfanina@gmail.com',
            'foto_card' => null,
            'whatsapp_template' => 
                    "Halo Klinik Dokter Fanina! 👋\n\n" .
                    "Saya ingin membuat reservasi untuk pemeriksaan hewan peliharaan saya.\n\n" .
                    "Mohon informasi lebih lanjut mengenai:\n" .
                    "• Jadwal yang tersedia\n" .
                    "• Jenis layanan yang ditawarkan\n" .
                    "• Estimasi biaya pemeriksaan\n\n" .
                    "Terima kasih! 🐾",
            'deskripsi_hero' => 'Buat pawrent, nggak ada yang lebih tenang selain tahu hewan kesayangannya sehat. Di Klinik Dokter Hewan Fanina, kami hadir untuk memberikan perawatan terbaik dengan penuh kasih sayang dan profesionalisme.',
            'judul_video_edukasi' => 'Serunya Belajar Bersama!',
            'deskripsi_video_edukasi' => 'Belajar tentang hewan jadi gampang! Tonton video edukasi kami yang informatif dan menarik.',
            'about_us' => 'Klinik Dokter Hewan Fanina hadir sebagai sahabat terpercaya bagi para pemilik hewan peliharaan.',
            'judul_layanan_tersedia' => 'Kami Hadir untuk Memberi Perawatan Terbaik!',
            'judul_promo_tersedia' => 'Perawatan Terbaik, Harga Lebih Hemat!',
            'deskripsi_artikel' => 'Artikel adalah halaman yang memuat informasi, pengetahuan, dan edukasi seputar topik tertentu.',
            'judul_footer' => 'KLINIK DOKTER HEWAN FANINA',
            'operating_hours' => 'Senin - Jumat: 08:00 - 17:00 WIB',
        ]);

        // Create default social media
        SocialMedia::create([
            'platform' => 'youtube',
            'url' => 'https://youtube.com/klinikdokterhewanfanina',
            'order' => 1,
        ]);

        SocialMedia::create([
            'platform' => 'instagram',
            'url' => 'https://instagram.com/klinikdokterhewanfanina',
            'order' => 2,
        ]);

        SocialMedia::create([
            'platform' => 'twitter',
            'url' => 'https://twitter.com/klinikdokterhewanfanina',
            'order' => 3,
        ]);
    }
}