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
        Schema::table('invoice', function (Blueprint $table) {
            if (!Schema::hasColumn('invoice', 'jatuh_tempo')) {
                $table->date('jatuh_tempo')->nullable()->after('tanggal');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoice', function (Blueprint $table) {
            if (Schema::hasColumn('invoice', 'jatuh_tempo')) {
                $table->dropColumn('jatuh_tempo');
            }
        });
    }
};