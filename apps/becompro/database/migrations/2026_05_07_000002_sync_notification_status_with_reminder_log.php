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
        DB::statement("\n            UPDATE notifications n\n            INNER JOIN reminder_log rl\n                ON rl.id_vaksinasi = n.id_vaksinasi\n               AND rl.reminder_type = n.reminder_type\n            SET n.status = 'success',\n                n.waktu_kirim = COALESCE(n.waktu_kirim, rl.sent_at),\n                n.updated_at = NOW()\n            WHERE rl.status = 'sent'\n              AND n.status = 'pending'\n        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Irreversible data backfill migration.
    }
};