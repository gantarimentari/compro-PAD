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
        Schema::table('reminder_vaksinasi', function (Blueprint $table) {
            // 1. Drop foreign key DULU
            $table->dropForeign(['id_vaksin']);
            
            // 2. Baru drop kolom
            if (Schema::hasColumn('reminder_vaksinasi', 'id_vaksin')) {
                $table->dropColumn('id_vaksin');
            }

            // 3. Buat kolom baru dengan foreign key
            $table->unsignedBigInteger('id_jenis_vaksin')->nullable()->after('id_hewan');
            $table->foreign('id_jenis_vaksin')
                ->references('id_vaksinasi')
                ->on('jenis_vaksin')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reminder_vaksinasi', function (Blueprint $table) {
            $table->dropForeign(['id_jenis_vaksin']);
            $table->dropColumn('id_jenis_vaksin');
            
            // Kembalikan kolom lama (opsional)
            $table->unsignedBigInteger('id_vaksin')->nullable()->after('id_hewan');
            $table->foreign('id_vaksin')
                ->references('id_vaksinasi')
                ->on('jenis_vaksin')
                ->onDelete('set null');
        });
    }
};