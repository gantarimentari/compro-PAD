<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReminderVaksinasi extends Model
{

    protected $table = 'reminder_vaksinasi';

    protected $primaryKey = 'id_vaksinasi';
    protected $fillable = [
        'id_pasien',
        'id_hewan',
        'id_jenis_vaksin',
        'tanggal_vaksin',

    ];

    protected $casts = [
        'tanggal_vaksin'=> 'date'
    ];

    public function pasien(){
        return $this->belongsTo(User::class, 'id_pasien');
    }

    public function hewan(){
        return $this->belongsTo(Hewan::class, 'id_hewan', 'id_hewan');
    }

    public function reminderLogs()
    {
        return $this->hasMany(ReminderLog::class, 'id_vaksinasi');
    }

    public function jenisVaksin()
    {
        return $this->belongsTo(JenisVaksin::class, 'id_jenis_vaksin', 'id_vaksinasi');
    }
}
