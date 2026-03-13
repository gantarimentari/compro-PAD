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
        Schema::create('reminder_vaksinasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_hewan')->constrained('hewan', 'id_hewan')->onDelete('cascade');
            $table->string('jenis_vaksin', 200);
            $table->date('tanggal_vaksin');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reminder_vaksinasi');
    }
};
