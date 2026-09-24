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
        Schema::create('luaran_jurnals', function (Blueprint $table) {
            $table->id();
            $table->enum('jenis_jurnal', ['scopus Q1', 'scopus Q2', 'scopus Q3', 'sinta 1', 'sinta 2', 'sinta 3', 'sinta 4', 'sinta 5', 'non sinta', 'non scopus']);
            $table->string('judul');
            $table->text('abstrak');
            $table->string('semester');
            $table->year('tahun');
            $table->string('link_berkas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('luaran_jurnals');
    }
};
