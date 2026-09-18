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
        Schema::create('dosens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fakultas_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('prodi_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nidn')->nullable();
            $table->string('nuptk')->nullable();
            $table->string('nama_dosen');
            $table->string('jenis_kelamin');
            $table->date('tanggal_lahir');
            $table->string('tempat_lahir');
            $table->text('alamat');
            $table->string('hp');
            $table->string('email');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('foto')->nullable();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dosens');
    }
};
