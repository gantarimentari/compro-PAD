fixnya gini:
1. di migration 2026_04_28_121433_update_notifications_status_values ubah jadi gini:
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('notifications')) {
            return;
        }

        $driver = DB::connection()->getDriverName();

        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE notifications MODIFY status ENUM('pending', 'sent', 'gagal', 'success', 'failed') NOT NULL DEFAULT 'pending'");
            DB::statement("UPDATE notifications SET status = 'success' WHERE status = 'sent'");
            DB::statement("UPDATE notifications SET status = 'failed' WHERE status = 'gagal'");
            DB::statement("ALTER TABLE notifications MODIFY status ENUM('pending', 'success', 'failed') NOT NULL DEFAULT 'pending'");
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('notifications')) {
            return;
        }

        $driver = DB::connection()->getDriverName();

        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE notifications MODIFY status ENUM('pending', 'sent', 'gagal', 'success', 'failed') NOT NULL DEFAULT 'pending'");
            DB::statement("UPDATE notifications SET status = 'sent' WHERE status = 'success'");
            DB::statement("UPDATE notifications SET status = 'gagal' WHERE status = 'failed'");
            DB::statement("ALTER TABLE notifications MODIFY status ENUM('pending', 'sent', 'gagal') NOT NULL DEFAULT 'pending'");
        }
    }
};

