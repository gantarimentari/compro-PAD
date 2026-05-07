<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE reminder_log MODIFY reminder_type ENUM('3_days_sebelum', '1_day_before', '7_day_before', 'same_day') NOT NULL");
        DB::statement("ALTER TABLE notifications MODIFY reminder_type ENUM('3_days_sebelum', '1_day_before', '7_day_before', 'same_day') NULL");

        DB::statement("UPDATE reminder_log SET reminder_type = '7_day_before' WHERE reminder_type = '1_day_before'");
        DB::statement("UPDATE notifications SET reminder_type = '7_day_before' WHERE reminder_type = '1_day_before'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE reminder_log MODIFY reminder_type ENUM('3_days_sebelum', '1_day_before', '7_day_before', 'same_day') NOT NULL");
        DB::statement("ALTER TABLE notifications MODIFY reminder_type ENUM('3_days_sebelum', '1_day_before', '7_day_before', 'same_day') NULL");

        DB::statement("UPDATE reminder_log SET reminder_type = '1_day_before' WHERE reminder_type = '7_day_before'");
        DB::statement("UPDATE notifications SET reminder_type = '1_day_before' WHERE reminder_type = '7_day_before'");

        DB::statement("ALTER TABLE reminder_log MODIFY reminder_type ENUM('3_days_sebelum', '1_day_before', 'same_day') NOT NULL");
        DB::statement("ALTER TABLE notifications MODIFY reminder_type ENUM('3_days_sebelum', '1_day_before', 'same_day') NULL");
    }
};