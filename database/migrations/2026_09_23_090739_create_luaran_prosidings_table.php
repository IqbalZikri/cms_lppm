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
        Schema::create('luaran_prosidings', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('abstrak');
            $table->string('semester');
            $table->year('tahun');
            $table->string('link_berkas');
            $table->text('penulis');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('luaran_prosidings');
    }
};
