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
        Schema::create('penulis', function (Blueprint $table) {
            $table->id();
            $table->morphs('penulisable');
            $table->foreignId('fakultas_id')->constrained()->nullOnDelete();
            $table->foreignId('dosen_id')->constrained()->nullOnDelete();
            $table->string('nama_fakultas');
            $table->string('nama_dosen');
            $table->unsignedTinyInteger('urutan')->default(1);
            $table->unique(['penulisable_type', 'penulisable_id', 'dosen_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penulis');
    }
};
