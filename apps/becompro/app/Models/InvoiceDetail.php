<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceDetail extends Model
{
    protected $table = 'invoice_detail';

    protected $fillable = [
        'id_invoice',
        'nama_item',
        'kategori',
        'qty',
        'harga_satuan',
        'subtotal'
    ];

    protected $casts = [
        'qty' => 'integer',
        'harga_satuan' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class, 'id_invoice', 'id_invoice');
    }
}