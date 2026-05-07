<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $primaryKey = 'id_notification';
    protected $table = 'notifications';
    protected $fillable = [
        'id_vaksinasi',
        'id_pasien',
        'recipient',
        'channel',
        'waktu_kirim',
        'tipe',
        'status',
        'reminder_type',
        'message_content',
        'error_message',
    ];
    protected $casts = [
        'waktu_kirim'=> 'datetime',
    ];

    public function pasien()
    {
        return $this->belongsTo(User::class, 'id_pasien', 'id');
    }

    public function vaksinasi()
    {
        return $this->belongsTo(ReminderVaksinasi::class, 'id_vaksinasi', 'id_vaksinasi');
    }


}