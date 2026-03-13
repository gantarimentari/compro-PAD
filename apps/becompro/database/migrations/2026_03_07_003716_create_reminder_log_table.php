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
        Schema::create('reminder_log', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_vaksinasi')->constrained('reminder_vaksinasi')->onDelete('cascade');
            $table->enum('reminder_type', ['3_days_sebelum', '1_day_before', 'same_day']);
            $table->string('phone_number', 20)->nullable();
            $table->enum('status', ['sent', 'failed'])->default('sent');
            $table->timestamp('sent_at');
            $table->boolean('is_manual')->default(false);
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->unique(['id_vaksinasi', 'reminder_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reminder_log');
    }
};
