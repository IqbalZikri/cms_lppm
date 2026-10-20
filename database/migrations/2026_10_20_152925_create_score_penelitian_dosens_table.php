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
        Schema::create('score_penelitian_dosens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dosen_id')->constrained()->cascadeOnDelete();
            $table->string("sinta_score_overall_versi_3")->nullable();
            $table->string("sinta_score_3yr")->nullable();
            $table->string("dokumen_scopus")->nullable();
            $table->string("sitasi_scopus")->nullable();
            $table->string("dokumen_tersitasi_scopus")->nullable();
            $table->string("h-index_scopus")->nullable();
            $table->string("g-index_scopus")->nullable();
            $table->string("i10-index_scopus")->nullable();
            $table->string("dokumen_gs")->nullable();
            $table->string("sitasi_gs")->nullable();
            $table->string("dokumen_tersitasi_gs")->nullable();
            $table->string("h-index_gs")->nullable();
            $table->string("g-index_gs")->nullable();
            $table->string("i10-index_gs")->nullable();
            $table->string("dokumen_wos")->nullable();
            $table->string("sitasi_wos")->nullable();
            $table->string("dokumen_tersitasi_wos")->nullable();
            $table->string("h-index_wos")->nullable();
            $table->string("g-index_wos")->nullable();
            $table->string("i10-index_wos")->nullable();
            $table->string("dokumen_garuda")->nullable();
            $table->string("sitasi_garuda")->nullable();
            $table->string("dokumen_tersitasi_garuda")->nullable();
            $table->string("status_aktif")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('score_penelitian_dosens');
    }
};
