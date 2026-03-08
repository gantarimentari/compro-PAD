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
        Schema::create('system_infos', function (Blueprint $table) {
            $table->id();
            $table->string('clinic_name');
            $table->text('address');
            $table->string('phone');
            $table->string('email');
            $table->string('foto_card')->nullable();
            $table->text('deskripsi_hero');
            $table->string('judul_video_edukasi');
            $table->text('deskripsi_video_edukasi');
            $table->text('about_us');
            $table->string('judul_layanan_tersedia');
            $table->string('judul_promo_tersedia');
            $table->text('deskripsi_artikel');
            $table->string('judul_footer');
            $table->string('operating_hours');
            $table->timestamps();
        });

        Schema::create('social_media', function (Blueprint $table) {
            $table->id();
            $table->enum('platform', ['facebook', 'instagram', 'twitter', 'youtube']);
            $table->string('url');
            $table->integer('order')->default(0); // untuk urutan tampilan
            $table->timestamps();
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_infos');
        Schema::dropIfExists('social_media');
    }
};
