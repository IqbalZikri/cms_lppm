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
            $table->foreignId('dosen_id')->constrained()->cascadeOnDelete();
            $table->enum('jenis_hki', ['paten', 'haki']);
            $table->string('judul_penelitian');
            $table->text('abstrak');
            $table->string('semester');
            $table->year('tahun');
            $table->string('link_berkas');
            $table->string('nomer_paten_haki'); // Nomer Pengajuan Haki / Nomer Paten
            $table->decimal('dana', 15, 2)->nullable();
            $table->string('sumber_dana')->nullable();
            $table->string('jumlah_dana')->nullable();
            $table->text('[penulis');
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
