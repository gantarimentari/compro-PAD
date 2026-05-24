<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    protected $table = 'invoice';
    protected $primaryKey = 'id_invoice';

    protected $fillable = [
        'id_pasien',
        'id_hewan',
        'kode_invoice',
        'tanggal_invoice',
        'jatuh_tempo',
        'subtotal',
        'diskon_persen',
        'diskon_nominal',
        'pajak_persen',
        'pajak_nominal',
        'total',
        'status',
        'catatan'
    ];

    protected $casts = [
        'tanggal_invoice' => 'date',
        'jatuh_tempo' => 'date',
        'subtotal' => 'decimal:2',
        'diskon_persen' => 'decimal:2',
        'diskon_nominal' => 'decimal:2',
        'pajak_persen' => 'decimal:2',
        'pajak_nominal' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    /**
     * Relasi: Invoice belongsTo Pasien (User)
     */
    public function pasien(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_pasien', 'id');
    }

    /**
     * Relasi: Invoice belongsTo Hewan
     */
    public function hewan(): BelongsTo
    {
        return $this->belongsTo(Hewan::class, 'id_hewan', 'id_hewan');
    }

    /**
     * Relasi: Invoice hasMany Details
     */
    public function details(): HasMany
    {
        return $this->hasMany(InvoiceDetail::class, 'id_invoice', 'id_invoice');
    }
}