<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WAService
{
    public function sendMessage($number = null, $remoteJid = null, $text = null)
    {
        $url = env('WHATSAPP_API_URL');
        $token = env('WHATSAPP_TOKEN');

        // ✅ Log configuration
        Log::info('🔧 WA Config:', [
            'url' => $url,
            'token_exists' => !empty($token),
            'token_length' => strlen($token ?? ''),
        ]);

        $body = [
            "number" => $number ?? "628xxxxxxx",
            "text" => (string)$text,
        ];

        Log::info('📤 WA API Request:', [
            'url' => $url,
            'body' => $body,
        ]);

        try {
            $response = Http::withHeaders([
                "apikey" => $token,
                "Content-Type" => "application/json",
            ])->post($url, $body);

            $result = $response->json();

            Log::info('📥 WA API Raw Response:', [
                'status' => $response->status(),
                'body' => $result,
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('❌ WA API Exception:', [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}