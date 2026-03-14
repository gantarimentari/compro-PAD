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
        Schema::create('jenis_vaksin', function (Blueprint $table) {
            $table->id('id_vaksinasi');
            $table->string('nama_vaksin');
            $table->integer('interval');
            $table->string('deskripsi', 200);
            $table->text('efek_samping');
            $table->enum('status', ['active', 'inactive']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jenis_vaksin');
    }
};
