<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendMail;

class SendMailController extends Controller
{
    public function index()
    {
        try {
            $content = [
                'name' => 'Bapak/Ibu Customer',
                'subject' => 'Konfirmasi Janji Temu',
                'body' => 'Terima kasih telah membuat janji temu di Praktik Dokter Hewan Fanina. Kami akan menghubungi Anda segera.'
            ];

            Mail::to('rakaiahmadmaulana@gmail.com')->send(new SendMail($content));

            return response()->json([
                'success' => true,
                'message' => 'Email berhasil dikirim!'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ Gagal mengirim email: ' . $e->getMessage()
            ], 500);
        }
    }
}
