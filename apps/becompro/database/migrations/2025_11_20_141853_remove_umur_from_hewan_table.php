<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('hewan', function (Blueprint $table) {
            $table->dropColumn('umur');
        });
    }

    public function down()
    {
        Schema::table('hewan', function (Blueprint $table) {
            $table->integer('umur')->nullable();
        });
    }
};