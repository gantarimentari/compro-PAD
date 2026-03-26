<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    protected $table = 'faq';
    protected $primaryKey = 'id_faq';

    protected $fillable = [
        'question',
        'answer',
        'keywords',
        'context',
    ];
}