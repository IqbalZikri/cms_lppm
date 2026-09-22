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
        Schema::create('pkms', function (Blueprint $table) {
            $table->id();
            $table->enum('jenis_pkm', ['pelaksanaan', 'jurnal']);
            $table->string('judul');
            $table->string('abstrak');
            $table->string('semester');
            $table->year('tahun');
            $table->string('link_berkas');
            $table->enum('sumber_dana', ['internal', 'eksternal']);
            $table->decimal('jumlah_dana', 15, 2);
            $table->text('penulis');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pkms');
    }
};
