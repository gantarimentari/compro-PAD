<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'Bagaimana cara membuat reservasi di klinik?',
                'answer' => 'Kamu bisa membuat reservasi lewat website pada menu reservasi atau menghubungi admin melalui WhatsApp klinik.',
                'keywords' => 'reservasi,jadwal,booking',
                'context' => 'reservasi',
            ],
            [
                'question' => 'Apakah klinik menerima vaksinasi hewan?',
                'answer' => 'Ya, klinik menerima layanan vaksinasi untuk hewan peliharaan sesuai jadwal yang tersedia.',
                'keywords' => 'vaksin,vaksinasi,hewan',
                'context' => 'layanan',
            ],
            [
                'question' => 'Bagaimana alur reminder vaksinasi bekerja?',
                'answer' => 'Sistem akan mengirim pengingat H-3, H-1, dan hari-H melalui WhatsApp jika nomor pemilik tersedia.',
                'keywords' => 'reminder,vaksinasi,whatsapp',
                'context' => 'reminder_vaksinasi',
            ],
            [
                'question' => 'Apa jam operasional klinik?',
                'answer' => 'Jam operasional dapat dilihat di halaman informasi klinik. Jika ada perubahan, admin akan memperbarui informasi tersebut.',
                'keywords' => 'jam operasional,jadwal klinik,buka',
                'context' => 'informasi_klinik',
            ],
            [
                'question' => 'Bagaimana jika saya lupa password akun?',
                'answer' => 'Gunakan fitur lupa password di halaman login, lalu ikuti instruksi reset password yang dikirim ke email.',
                'keywords' => 'lupa password,reset akun,login',
                'context' => 'autentikasi',
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::updateOrCreate(
                ['question' => $faq['question']],
                [
                    'answer' => $faq['answer'],
                    'keywords' => $faq['keywords'],
                    'context' => $faq['context'],
                ]
            );
        }
    }
}