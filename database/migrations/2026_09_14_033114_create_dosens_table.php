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
        Schema::create('dosens', function (Blueprint $table) {
            $table->id();
            $table->string('sintaid');
            $table->foreignId('fakultas_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('prodi_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nidn')->nullable();
            $table->string('nuptk')->nullable();
            $table->string('nama_dosen');
            $table->enum('pendidikan_terakhir', ["SD", "SMP", "SMP", "S1", "S2", "S3"]);
            $table->enum('jabatan_fungsional', ["Asisten Ahli", "Lektor", "Lektor Kepala", "Guru Besar"]);
            $table->string('gelar_depan')->nullable();
            $table->string('gelar_belakang')->nullable();
            $table->enum('jenis_kelamin', ["L", "P"])->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('tempat_lahir')->nullable();
            $table->text('alamat')->nullable();
            $table->string('hp')->nullable();
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
