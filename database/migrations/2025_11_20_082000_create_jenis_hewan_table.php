<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jenis_hewan', function (Blueprint $table) {
            $table->id('id_jenisHewan');
            $table->unsignedBigInteger('id_pasien');
            $table->string('nama_jenis');
            $table->timestamps();

            $table->foreign('id_pasien')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jenis_hewan');
    }
};