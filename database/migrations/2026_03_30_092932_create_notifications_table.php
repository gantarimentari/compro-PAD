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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id('id_notification');
            $table->foreignId('id_vaksinasi')->constrained('reminder_vaksinasi', 'id_vaksinasi')->onDelete('cascade');
            $table->foreignId('id_pasien')->constrained('users', 'id')->onDelete('cascade');
            $table->string('recipient', 255);
            $table->enum('channel', ['wa', 'email']);
            $table->timestamp('waktu_kirim')->nullable();
            $table->enum('tipe', ['vaksinasi', 'reservasi'])->default('vaksinasi');
            $table->enum('status', ['pending', 'sent', 'gagal'])->default('pending');
            $table->enum('reminder_type', ['3_days_sebelum', '1_day_before', 'same_day'])->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
