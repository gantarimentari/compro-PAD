<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemInfo extends Model
{
    protected $fillable = [
        'clinic_name',
        'address',
        'phone',
        'whatsapp_template',
        'email',
        'foto_card',
        'deskripsi_hero',
        'judul_video_edukasi',
        'deskripsi_video_edukasi',
        'about_us',
        'judul_layanan_tersedia',
        'judul_promo_tersedia',
        'deskripsi_artikel',
        'judul_footer',
        'operating_hours',
    ];

    public function getFormattedDataAttribute()
    {
        return [
            'clinicName' => $this->clinic_name,
            'address' => $this->address,
            'phone' => $this->phone,
            'whatsappTemplate'=>$this->whatsapp_template,
            'email' => $this->email,
            'fotoCard' => $this->foto_card,
            'deskripsiHero' => $this->deskripsi_hero,
            'judulVideoEdukasi' => $this->judul_video_edukasi,
            'deskripsiVideoEdukasi' => $this->deskripsi_video_edukasi,
            'aboutUs' => $this->about_us,
            'judulLayananTersedia' => $this->judul_layanan_tersedia,
            'judulPromoTersedia' => $this->judul_promo_tersedia,
            'deskripsiArtikel' => $this->deskripsi_artikel,
            'judulFooter' => $this->judul_footer,
            'operatingHours' => $this->operating_hours,
        ];
    }
}
