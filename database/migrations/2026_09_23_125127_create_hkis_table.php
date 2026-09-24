<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hkis', function (Blueprint $table) {
            $table->id();
            $table->enum('jenis_hki', ['paten', 'haki']);
            $table->string('judul');
            $table->text('abstrak');
            $table->string('semester');
            $table->year('tahun');
            $table->string('link_berkas');
            $table->string('nomer_pengajuan_haki')->nullable();
            $table->string('nomer_paten')->nullable();
            $table->decimal('jumlah_dana', 15, 2)->nullable();
            $table->enum('sumber_dana', ['internal', 'eksternal']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hkis');
    }
};
