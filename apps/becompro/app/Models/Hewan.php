<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
class Hewan extends Model
{
    protected $table = 'hewan';
    protected $primaryKey = 'id_hewan';

    protected $fillable = [
        'id_pasien',
        'id_jenisHewan',
        'nama_hewan',
        'tanggal_lahir_hewan',
    ];

    protected $appends = ['umur'];

    public function getUmurAttribute()
{
    if (!$this->tanggal_lahir_hewan) {
        return null;
    }

    //  Method Carbon yang lebih simple
    return Carbon::parse($this->tanggal_lahir_hewan)
        ->locale('id') // Set bahasa Indonesia
        ->diffForHumans(null, true); // true = remove "yang lalu"
}

    public function pasien()
    {
        return $this->belongsTo(User::class, 'id_pasien', 'id');
    }

    public function jenisHewan()
    {
        return $this->belongsTo(JenisHewan::class, 'id_jenisHewan', 'id_jenisHewan');
    }
}