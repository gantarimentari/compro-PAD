<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisHewan extends Model
{
    protected $table = 'jenis_hewan';
    protected $primaryKey = 'id_jenisHewan';
    public $incrementing = true;
    protected $fillable = ['nama_jenis',  'id_pasien'];

    public function pasien(){
        return $this->belongsTo(User::class,'id_pasien');
    }

    public function hewans()
    {
        return $this->hasMany(Hewan::class, 'id_jenisHewan', 'id_jenisHewan');
    }
}