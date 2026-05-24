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
        Schema::create('invoice', function (Blueprint $table) {
             $table->id('id_invoice');

            $table->foreignId('id_pasien')->constrained('users')->onDelete('cascade');
            $table->foreignId('id_hewan')->constrained('hewan', 'id_hewan')->onDelete('cascade');

            $table->string('kode_invoice')->unique()->nullable();

            $table->date('tanggal_invoice');
            $table->date('jatuh_tempo')->nullable();

            $table->decimal('subtotal', 12, 2)->default(0);

            $table->decimal('diskon_persen', 5, 2)->default(0);
            $table->decimal('diskon_nominal', 12, 2)->default(0);

            $table->decimal('pajak_persen', 5, 2)->default(0);
            $table->decimal('pajak_nominal', 12, 2)->default(0);

            $table->decimal('total', 12, 2)->default(0);

            $table->enum('status', [
                'belum_lunas',
                'lunas'
            ])->default('belum_lunas');

            $table->text('catatan')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice');
    }
};