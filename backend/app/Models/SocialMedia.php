<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialMedia extends Model
{
    protected $table = 'social_media';

    protected $fillable = [
        'platform',
        'url',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];
}
