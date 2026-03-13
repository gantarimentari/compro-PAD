<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hewan', function (Blueprint $table) {
            $table->id('id_hewan');
            $table->unsignedBigInteger('id_pasien');
            $table->unsignedBigInteger('id_jenisHewan');
            $table->string('nama_hewan');
            $table->date('tanggal_lahir_hewan')->nullable();
            $table->integer('umur')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('id_pasien')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('id_jenisHewan')
                ->references('id_jenisHewan')
                ->on('jenis_hewan')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hewan');
    }
};