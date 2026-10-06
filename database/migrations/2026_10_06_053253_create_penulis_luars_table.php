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
        Schema::create('penulis_luars', function (Blueprint $table) {
            $table->id();
            $table->morphs('penulisable_luar');
            $table->string("nama_universitas");
            $table->string("nama_dosen");
            $table->unsignedTinyInteger('urutan')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penulis_luars');
    }
};
