<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisVaksin extends Model
{
    protected $table = 'jenis_vaksin';
    protected $primaryKey = 'id_vaksinasi';

    protected $fillable = [
        'nama_vaksin',
        'interval',
        'deskripsi',
        'efek_samping',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function reminderVaksinasi()
    {
        return $this->hasMany(ReminderVaksinasi::class, 'id_jenis_vaksin', 'id_vaksinasi');
    }
}
