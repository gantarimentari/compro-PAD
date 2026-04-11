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
            if (Schema::hasColumn('reminder_vaksinasi', 'jenis_vaksin')) {
                $table->dropColumn('jenis_vaksin');
            }

            if (!Schema::hasColumn('reminder_vaksinasi', 'id_vaksin')) {
                $table->unsignedBigInteger('id_vaksin')->nullable()->after('id_hewan');
                $table->foreign('id_vaksin')
                    ->references('id_vaksinasi')
                    ->on('jenis_vaksin')
                    ->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reminder_vaksinasi', function (Blueprint $table) {
            $table->dropForeign(['id_vaksin']);
            $table->dropColumn('id_vaksin');
            $table->string('jenis_vaksin', 200)->after('id_hewan');
        });
    }
};
