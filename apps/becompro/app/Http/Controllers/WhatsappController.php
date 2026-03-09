<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\WAService;
use Illuminate\Support\Facades\Log;

class WhatsappController extends Controller
{
    public function send(Request $request, WAService $wa)
    {
        //  Log raw request
        Log::info('📥 Incoming WA Request:', [
            'all' => $request->all(),
            'json' => $request->json()->all(),
            'body' => $request->getContent(),
        ]);

        //  Validate request
        $validated = $request->validate([
            'number' => 'required|string',
            'text' => 'required|string',
        ]);

        Log::info('📤 Validated data:', $validated);

        try {
            $response = $wa->sendMessage(
                $validated['number'],
                null, // remoteJid not used
                $validated['text']
            );

            Log::info(' WA API Response:', $response);

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully',
                'data' => $response
            ]);

        } catch (\Exception $e) {
            Log::error('❌ WA API Error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to send message',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}