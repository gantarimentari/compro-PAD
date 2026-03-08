<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $fillable = ['name', 'category', 'image_url', 'video_url'];

    // Jangan gunakan appends dulu, kita format di controller
}
