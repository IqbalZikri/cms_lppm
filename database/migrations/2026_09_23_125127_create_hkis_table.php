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
            $table->enum('jenis_hki', ['paten', 'haki'])->nullable();
            $table->string('judul')->nullable();
            $table->text('abstrak')->nullable();
            $table->string('semester')->nullable();
            $table->year('tahun')->nullable();
            $table->string('link_berkas')->nullable();
            $table->string('nomer_pengajuan_haki')->nullable();
            $table->string('nomer_paten')->nullable();
            $table->decimal('jumlah_dana', 15, 2)->nullable();
            $table->enum('sumber_dana', ['internal', 'eksternal'])->nullable();
            $table->string('status_pengajuan')->nullable();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
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
