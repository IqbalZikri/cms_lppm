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
        Schema::create('penulis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kegiatans_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('pkms_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('hkis_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('luaran_prosidings_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('luaran_jurnals_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('fakultas_id')->constrained()->cascadeOnDelete();
            $table->foreignId('dosen_id')->constrained()->cascadeOnDelete();
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
