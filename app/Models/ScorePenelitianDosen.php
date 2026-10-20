<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScorePenelitianDosen extends Model
{
    protected $fillable = [
        'dosen_id',
        'sinta_score_overall_versi_3',
        'sinta_score_3yr',
        'dokumen_scopus',
        'sitasi_scopus',
        'dokumen_tersitasi_scopus',
        'h-index_scopus',
        'g-index_scopus',
        'i10-index_scopus',
        'dokumen_gs',
        'sitasi_gs',
        'dokumen_tersitasi_gs',
        'h-index_gs',
        'g-index_gs',
        'i10-index_gs',
        'dokumen_wos',
        'sitasi_wos',
        'dokumen_tersitasi_wos',
        'h-index_wos',
        'g-index_wos',
        'i10-index_wos',
        'dokumen_garuda',
        'sitasi_garuda',
        'dokumen_tersitasi_garuda',
        'status_aktif'
    ];

    public function dosen()
    {
        return $this->belongsTo(Dosen::class);
    }
}
