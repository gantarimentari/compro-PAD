<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('invoice', 'tanggal_invoice')) {
            Schema::table('invoice', function (Blueprint $table) {
                $table->date('tanggal_invoice')->nullable()->after('tanggal');
            });
        }

        if (Schema::hasColumn('invoice', 'tanggal') && Schema::hasColumn('invoice', 'tanggal_invoice')) {
            DB::statement('UPDATE invoice SET tanggal_invoice = tanggal WHERE tanggal_invoice IS NULL AND tanggal IS NOT NULL');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('invoice', 'tanggal_invoice')) {
            Schema::table('invoice', function (Blueprint $table) {
                $table->dropColumn('tanggal_invoice');
            });
        }
    }
};