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
            if (!Schema::hasColumn('reminder_vaksinasi', 'status')) {
                $table->string('status', 50)->default('Dijadwalkan')->after('tanggal_vaksin');
            }

            if (!Schema::hasColumn('reminder_vaksinasi', 'tanggal_vaksin_aktual')) {
                $table->date('tanggal_vaksin_aktual')->nullable()->after('status');
            }

            if (!Schema::hasColumn('reminder_vaksinasi', 'dilakukan_oleh')) {
                $table->string('dilakukan_oleh')->nullable()->after('tanggal_vaksin_aktual');
            }

            if (!Schema::hasColumn('reminder_vaksinasi', 'catatan')) {
                $table->text('catatan')->nullable()->after('dilakukan_oleh');
            }

            if (!Schema::hasColumn('reminder_vaksinasi', 'jadwal_vaksin_berikutnya')) {
                $table->date('jadwal_vaksin_berikutnya')->nullable()->after('catatan');
            }

            if (!Schema::hasColumn('reminder_vaksinasi', 'tipe_jadwal')) {
                $table->string('tipe_jadwal', 20)->nullable()->after('jadwal_vaksin_berikutnya');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reminder_vaksinasi', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'tanggal_vaksin_aktual',
                'dilakukan_oleh',
                'catatan',
                'jadwal_vaksin_berikutnya',
                'tipe_jadwal',
            ]);
        });
    }
};
