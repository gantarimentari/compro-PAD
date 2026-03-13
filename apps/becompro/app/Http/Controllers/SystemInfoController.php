<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SystemInfoController extends Controller
{
    /**
     * Get system info (PUBLIC - No auth required)
     */
    public function index()
    {
        $systemInfo = DB::table('system_infos')->first();
        $socialMediaRecords = DB::table('social_media')->get();

        //  Format social media untuk frontend
        $socialMedia = $socialMediaRecords->map(function($item) {
            return [
                'id'=>$item->id,
                'name' => ucfirst($item->platform), // Instagram, Youtube, dll
                'href' => $item->url,
                'platform'=>$item->platform,
                'url'=>$item->url,
                'icon' => strtolower($item->platform), // instagram, youtube, dll
            ];
        })->toArray();

        //  Format phone untuk display (+62-XXX-XXXX-XXXX)
        $phone = $systemInfo->phone ?? '+6212345678999';
        $phoneDisplay = $this->formatPhoneDisplay($phone);

        return response()->json([
            'systemInfo' => $systemInfo ? [
                'clinic_name' => $systemInfo->clinic_name,
                'address' => $systemInfo->address,
                'phone' => $phone,
                'whatsapp_template'=> $systemInfo->whatsapp_template,
                'phoneDisplay' => $phoneDisplay,
                'email' => $systemInfo->email,
                'operating_hours' => $systemInfo->operating_hours,
                'foto_card' => $systemInfo->foto_card,
                'deskripsi_hero' => $systemInfo->deskripsi_hero,
                'judul_video_edukasi' => $systemInfo->judul_video_edukasi,
                'deskripsi_video_edukasi' => $systemInfo->deskripsi_video_edukasi,
                'about_us' => $systemInfo->about_us,
                'judul_layanan_tersedia' => $systemInfo->judul_layanan_tersedia,
                'judul_promo_tersedia' => $systemInfo->judul_promo_tersedia,
                'deskripsi_artikel' => $systemInfo->deskripsi_artikel,
                'judul_footer' => $systemInfo->judul_footer,
                'socialMedia' => $socialMedia,
            ] : [
                'clinic_name' => 'Klinik Dokter Hewan Fanina',
                'address' => '',
                'phone' => '+6212345678999',
                'phoneDisplay' => '+62-123-4567-8999',
                'whatsapp_template'=> '',
                'email' => '',
                'operating_hours' => '',
                'foto_card' => null,
                'deskripsi_hero' => '',
                'judul_video_edukasi' => '',
                'deskripsi_video_edukasi' => '',
                'about_us' => 'Klinik Dokter Hewan Fanina hadir sebagai sahabat terpercaya...',
                'judul_layanan_tersedia' => '',
                'judul_promo_tersedia' => '',
                'deskripsi_artikel' => '',
                'judul_footer' => '',
                'socialMedia' => [],
            ],
        ]);
    }

    /**
     * Format phone number for display
     * Example: +6212345678999 → +62-123-4567-8999
     */
    private function formatPhoneDisplay($phone)
    {
        if (!$phone) return '';
        
        // Remove all non-digit characters except +
        $cleaned = preg_replace('/[^0-9+]/', '', $phone);
        
        // Format: +62-XXX-XXXX-XXXX
        if (preg_match('/^\+62(\d{3})(\d{4})(\d+)$/', $cleaned, $matches)) {
            return "+62-{$matches[1]}-{$matches[2]}-{$matches[3]}";
        }

        if(preg_match('/[a-zA-Z]/', $phone)){
            \Log::warning('phone terdapat kalimat/kata. ubah ke nomor telepon asli');
            return 'invalid phone number';

        }
        
        return $phone; // Return original if format doesn't match
    }

    /**
     * Update system info (ADMIN only)
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'clinic_name' => ['nullable', 'string', 'max:150', function ($attribute, $value, $fail){
                $wordCount = str_word_count($value);
                if ($wordCount > 15){
                    $fail('Nama klinik maksimal 15 kata (saat ini: ' . $wordCount . ' kata)');
                }
            },
            ],
            'address' => ['nullable','string','max:255', function ($attribute, $value, $fail) {
                $wordCount = str_word_count($value);
                if($wordCount > 50){
                    $fail('Alamat maksimal 50 kata (saat ini: ' . $wordCount . ' kata)');
                }
            }],
            'phone' => ['nullable','string','max:20', function ($attribute, $value, $fail){
                if (!$value) return; // Skip jika null/empty
                
                // Cek apakah ada huruf
                if (preg_match('/[a-zA-Z]/', $value)) {
                    $fail('Nomor telepon tidak boleh mengandung huruf');
                    return;
                }
                
                // Cek format harus diawali +62
                if (!preg_match('/^\+62/', $value)) {
                    $fail('Nomor telepon harus diawali dengan +62');
                    return;
                }
                
                // Cek minimal panjang (setelah +62 harus ada 9-13 digit)
                $digits = preg_replace('/[^0-9]/', '', substr($value, 3)); // Ambil digit setelah +62
                if (strlen($digits) < 9 || strlen($digits) > 13) {
                    $fail('Nomor telepon harus terdiri dari 9-13 digit setelah +62');
                }
            }],
            'whatsapp_template'=>'nullable|string|max:500',
            'email' => 'nullable|email|max:255',
            'foto_card' => 'nullable|string',
            'deskripsi_hero' => 'nullable|string',
            'judul_video_edukasi' => 'nullable|string|max:255',
            'deskripsi_video_edukasi' => 'nullable|string',
            'about_us' => 'nullable|string',
            'judul_layanan_tersedia' => 'nullable|string|max:255',
            'judul_promo_tersedia' => 'nullable|string|max:255',
            'deskripsi_artikel' => 'nullable|string',
            'judul_footer' => 'nullable|string|max:255',
            'operating_hours' => 'nullable|string|max:255',
            'link_gmaps' => 'nullable|url',
            'link_gmaps_embed' => 'nullable|url',
        ]);

        DB::table('system_infos')->updateOrInsert(
            ['id' => 1],
            array_merge($validated, [
                'updated_at' => now(),
            ])
        );

        $systemInfo = DB::table('system_infos')->first();

        return response()->json([
            'message' => 'System info berhasil diperbarui',
            'systemInfo' => $systemInfo,
        ]);
    }

    // Social Media methods...
    public function getSocialMedia()
    {
        $socialMedia = DB::table('social_media')->get();
        return response()->json($socialMedia);
    }

    public function storeSocialMedia(Request $request)
    {
        $validated = $request->validate([
            'platform' => 'required|string|max:50',
            'url' => 'required|url|max:255',
        ]);

        $id = DB::table('social_media')->insertGetId([
            'platform' => strtolower($validated['platform']), //  Store lowercase
            'url' => $validated['url'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Social media berhasil ditambahkan',
            'id' => $id,
        ]);
    }

    public function updateSocialMedia(Request $request, $id)
    {
        $validated = $request->validate([
            'url' => 'required|url|max:255',
        ]);

        DB::table('social_media')
            ->where('id', $id)
            ->update([
                'url' => $validated['url'],
                'updated_at' => now(),
            ]);

        return response()->json([
            'message' => 'Social media berhasil diperbarui',
        ]);
    }

    public function deleteSocialMedia($id)
    {
        DB::table('social_media')->where('id', $id)->delete();

        return response()->json([
            'message' => 'Social media berhasil dihapus',
        ]);
    }
}
