<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'id_pasien',
        'id_hewan',
        'tanggal_reservasi',
        'keluhan',
        'status'
    ];

    protected $casts = [
        'tanggal_reservasi' => 'date',
    ];

    //relasi
    public function hewan(){
        return $this->belongsTo(Hewan::class, 'id_hewan', 'id_hewan');
    }

    public function pasien(){
        return $this->belongsTo(User::class, 'id_pasien');
    }
}
