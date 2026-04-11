<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoice', function (Blueprint $table) {
            $table->id('id_invoice');

            $table->unsignedBigInteger('id_pasien');
            $table->unsignedBigInteger('id_hewan');

            $table->date('tanggal');

            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('diskon_persen', 5, 2)->nullable();
            $table->decimal('diskon_nominal', 10, 2)->default(0);

            $table->decimal('total', 10, 2);

            $table->enum('status', ['lunas', 'belum_lunas'])->default('belum_lunas');

            $table->timestamps();

            $table->foreign('id_pasien')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('id_hewan')
                ->references('id_hewan')
                ->on('hewan')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoice');
    }
};
