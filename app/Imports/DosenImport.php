<?php

namespace App\Imports;

use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Prodi;
use App\Models\ScorePenelitianDosen;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class DosenImport implements ToCollection, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use Importable, SkipsFailures;

    public function rules(): array
    {
        return [
            "sintaid" => ["required"],
            "nidn" => ["required"],
            "nama" => ["required"],
            'fakultas' => ["required", "string"],
            'prodi' => ["required", "string"],
            'email' => ["required", "email"],
            'pendidikan_terakhir' => ["required"],
            'jabatan_fungsional' => ["required"],
        ];
    }

    public function customValidationMessages()
    {
        return [
            "sintaid.required" => "SINTAID tidak boleh kosong",
            "nidn.required" => "NIDN tidak boleh kosong",
            "nama.required" => "Nama Dosen tidak boleh kosong",
            "fakultas.required" => "Fakultas tidak boleh kosong",
            "prodi.required" => "Prodi tidak boleh kosong",
            "email.required" => "Email tidak boleh kosong",
            "pendidikan_terakhir.required" => "Pendidikan terakhir tidak boleh kosong",
            "jabatan_fungsional.required" => "Jabatan Fungsional tidak boleh kosong",
        ];
    }

    public function collection(Collection $collection): void
    {
        DB::transaction(function () use ($collection) {
            foreach ($collection as $row) {
                $fakultas = Fakultas::firstOrCreate([
                    "nama_fakultas" => trim((string) ($row['fakultas'] ?? ''))
                ]);


                $prodi = Prodi::where("fakultas_id", $fakultas->id)->firstOrCreate([
                    "fakultas_id" => $fakultas->id,
                    "nama_prodi" => trim((string) ($row['prodi'] ?? ''))
                ]);

                $user = User::firstOrCreate(
                    ['email' => trim($row['email'])],
                    [
                        'name' => $row['nama'],
                        'password' => Hash::make((string) $row["nidn"]),
                        'role' => 'dosen',
                    ]
                );

                $dosen = Dosen::updateOrCreate(
                    ['nidn' => (string) $row['nidn']],
                    [
                        'sintaid' => $row['sintaid'],
                        'nama_dosen' => $row['nama'],
                        'fakultas_id' => $fakultas->id,
                        'prodi_id' => $prodi->id,
                        'email' => trim($row['email']),
                        'pendidikan_terakhir' => $row['pendidikan_terakhir'],
                        'jabatan_fungsional' => $row['jabatan_fungsional'],
                        'gelar_depan' => $row['gelar_depan'] ?? null,
                        'gelar_belakang' => $row['gelar_belakang'],
                        'user_id' => $user->id,
                    ]
                );

                ScorePenelitianDosen::updateOrCreate(
                    [
                        'dosen_id' => $dosen->id,
                    ],
                    [
                        'sinta_score_overall_versi_3' => $row['sinta_score_overall_versi_3'] ?? '0',
                        'sinta_score_3yr' => $row['sinta_score_3yr'] ?? '0',
                        'dokumen_scopus' => $row['dokumen_scopus'] ?? '0',
                        'sitasi_scopus' => $row['sitasi_scopus'] ?? '0',
                        'dokumen_tersitasi_scopus' => $row['dokumen_tersitasi_scopus'] ?? '0',
                        'h-index_scopus' => $row['h-index_scopus']  ?? '0',
                        'g-index_scopus' => $row['g-index_scopus'] ?? '0',
                        'i10-index_scopus' => $row['i10-index_scopus'] ?? '0',
                        'dokumen_gs' => $row['dokumen_gs'] ?? '0',
                        'sitasi_gs' => $row['sitasi_gs'] ?? '0',
                        'dokumen_tersitasi_gs' => $row['dokumen_tersitasi_gs'] ?? '0',
                        'h-index_gs' => $row['h-index_gs'] ?? '0',
                        'g-index_gs' => $row['g-index_gs'] ?? '0',
                        'i10-index_gs' => $row['i10-index_gs'] ?? '0',
                        'dokumen_wos' => $row['dokumen_wos'] ?? '0',
                        'sitasi_wos' => $row['sitasi_wos'] ?? '0',
                        'dokumen_tersitasi_wos' => $row['dokumen_tersitasi_wos'] ?? '0',
                        'h-index_wos' => $row['h-index_wos'] ?? '0',
                        'g-index_wos' => $row['g-index_wos'] ?? '0',
                        'i10-index_wos' => $row['i10-index_wos'] ?? '0',
                        'dokumen_garuda' => $row['dokumen_garuda'] ?? '0',
                        'sitasi_garuda' => $row['sitasi_garuda'] ?? '0',
                        'dokumen_tersitasi_garuda' => $row['dokumen_tersitasi_garuda'] ?? '0',
                        'status_aktif' => $row['status_aktif']
                    ]
                );
            }
        });
    }
}
