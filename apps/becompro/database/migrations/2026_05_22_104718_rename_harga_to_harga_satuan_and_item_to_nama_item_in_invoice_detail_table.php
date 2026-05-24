<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('invoice_detail', function (Blueprint $table) {
            $table->renameColumn('harga', 'harga_satuan');
            $table->renameColumn('item', 'nama_item');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoice_detail', function (Blueprint $table) {
            $table->renameColumn('harga_satuan', 'harga');
            $table->renameColumn('nama_item', 'item');
        });
    }
};