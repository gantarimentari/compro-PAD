<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReminderLog extends Model
{

    protected $table='reminder_log';

    protected $fillable =[
        'id_vaksinasi',
        'reminder_type',
        'phone_number',
        'status',
        'sent_at',
        'is_manual',
        'error_message'
    ];

    protected $casts = [
        'sent_at'=> 'datetime',
        'is_manual'=> 'boolean',
    ];

        public function vaksinasi()
    {
        return $this->belongsTo(ReminderVaksinasi::class, 'id_vaksinasi');
    }
}
