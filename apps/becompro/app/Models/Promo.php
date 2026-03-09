<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promo extends Model
{
    protected $fillable = [
        'title',
        'description',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'start_date'=> 'date',
        'end_date' => 'date',
        'created_at'=>'datetime',
        'updated_at'=>'datetime',
    ];

    public function getFormattedStartDateAttribute()
    {
        return $this->start_date->format('d/m/Y');
    }

    public function getFormattedEndDateAttribute()
    {
        return $this->end_date->format('d/m/Y');
    }

    public function isActive(){
        $now = now();
        return $this ->status === 'available' && $this -> start_date <= $now && $this ->end_date >= $now;
    }
}
