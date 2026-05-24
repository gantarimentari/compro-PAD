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
        Schema::create('invoice_detail', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_invoice');
            $table->string('item');
            $table->string('kategori')->nullable();
            $table->integer('qty')->default(1);

            $table->decimal('harga', 12, 2);

            $table->decimal('subtotal', 12, 2);

            $table->timestamps();

            $table->foreign('id_invoice')
                ->references('id_invoice')
                ->on('invoice')
                ->onDelete('cascade');

                
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_detail');
    }
};