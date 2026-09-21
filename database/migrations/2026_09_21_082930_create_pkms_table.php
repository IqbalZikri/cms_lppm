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
            $table->foreignId('dosen_id')->constrained()->cascadeOnDelete();
            $table->enum('jenis_pkm', ['pelaksanaan', 'jurnal']);
            $table->string('judul_pkm');
            $table->text('abstrak');
            $table->string('semester');
            $table->year('tahun');
            $table->decimal('dana', 15, 2)->nullable();
            $table->string('sumber_dana')->nullable();
            $table->string('jumlah_dana')->nullable();
            $table->text('pelaksana');
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
