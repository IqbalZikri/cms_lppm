<?php

namespace App\Imports;

use App\Models\Dosen;
use App\Models\ScorePenelitianDosen;
use DB;
use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Collection;

class ScorePenelitianDosenImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $collection): void
    {
        DB::transaction(function () use ($collection) {
            foreach ($collection as $row) {
                $dosen = Dosen::where('nidn', $row['nidn'])->first();

                ScorePenelitianDosen::updateOrCreate(
                    [
                        'dosen_id' => $dosen->id,
                    ],
                    [
                        'sinta_score_overall_versi_3' => $row['sinta_score_overall_versi_3'],
                        'sinta_score_3yr' => $row['sinta_score_3yr'],
                        'dokumen_scopus' => $row['dokumen_scopus'],
                        'sitasi_scopus' => $row['sitasi_scopus'],
                        'dokumen_tersitasi_scopus' => $row['dokumen_tersitasi_scopus'],
                        'h-index_scopus' => $row['h-index_scopus'],
                        'g-index_scopus' => $row['g-index_scopus'],
                        'i10-index_scopus' => $row['i10-index_scopus'],
                        'dokumen_gs' => $row['dokumen_gs'],
                        'sitasi_gs' => $row['sitasi_gs'],
                        'dokumen_tersitasi_gs' => $row['dokumen_tersitasi_gs'],
                        'h-index_gs' => $row['h-index_gs'],
                        'g-index_gs' => $row['g-index_gs'],
                        'i10-index_gs' => $row['i10-index_gs'],
                        'dokumen_wos' => $row['dokumen_wos'],
                        'sitasi_wos' => $row['sitasi_wos'],
                        'dokumen_tersitasi_wos' => $row['dokumen_tersitasi_wos'],
                        'h-index_wos' => $row['h-index_wos'],
                        'g-index_wos' => $row['g-index_wos'],
                        'i10-index_wos' => $row['i10-index_wos'],
                        'dokumen_garuda' => $row['dokumen_garuda'],
                        'sitasi_garuda' => $row['sitasi_garuda'],
                        'dokumen_tersitasi_garuda' => $row['dokumen_tersitasi_garuda'],
                        'status_aktif' => $row['status_aktif']
                    ]
                );
            }
        });
    }
}
