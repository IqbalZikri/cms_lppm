<?php

namespace App\Imports;

use App\Models\Dosen;
use App\Models\LuaranJurnal;
use App\Models\Penulis;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Validators\Failure;

class JurnalImport implements ToCollection, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use Importable, SkipsFailures;
    public function rules(): array
    {
        return [
            'nidn' => ['required', 'exists:dosens,nidn'],
            'jenis_luaran_jurnal' => [
                'required',
                Rule::in([
                    'scopus q1',
                    'scopus q2',
                    'scopus q3',
                    'sinta 1',
                    'sinta 2',
                    'sinta 3',
                    'sinta 4',
                    'sinta 5',
                    'non sinta',
                    'non scopus',
                ])
            ],
            'judul' => ['required', 'string'],
            'tahun' => ['required', 'digits:4'],
            'link_berkas' => ['required', 'url'],
        ];
    }

    public function customValidationMessages()
    {
        return [
            'nidn.required' => 'NIDN tidak boleh kosong',
            'nidn.exists' => 'Dosen dengan NIDN ini tidak ditemukan',
            'jenis_luaran_jurnal.in' => 'Jenis luaran jurnal tidak valid',
            'judul.required' => 'Judul tidak boleh kosong',
            'tahun.digits' => 'Tahun harus 4 digit',
            'link_berkas.url' => 'Link berkas harus berupa URL valid',
        ];
    }

    public function prepareForValidation($data, $index)
    {
        $data['nidn'] = isset($data['nidn']) ? (string) $data['nidn'] : null;
        $data['jenis_luaran_jurnal'] = isset($data['jenis_luaran_jurnal'])
            ? strtolower(trim($data['jenis_luaran_jurnal']))
            : null;

        return $data;
    }

    public function collection(Collection $collection): void
    {
        DB::transaction(function () use ($collection) {
            foreach ($collection as $index => $row) {
                $dosen = Dosen::with('user')->where('nidn', (string) $row['nidn'])->first();

                if (!$dosen?->user) {
                    $this->onFailure(new Failure(
                        $index + 2,
                        'nidn',
                        ['Dosen tidak ditemukan atau belum memiliki akun user'],
                        $row->toArray()
                    ));
                    continue;
                }

                $luaranJurnal = LuaranJurnal::updateOrCreate(
                    [
                        'user_id' => $dosen->user->id,
                        'judul' => $row['judul'],
                        'tahun' => $row['tahun'],
                    ],
                    [
                        'jenis_luaran_jurnal' => strtolower(trim($row['jenis_luaran_jurnal'])),
                        'abstrak' => $row['abstrak'] ?? '-',
                        'semester' => $row['semester'] ?? '-',
                        'link_berkas' => $row['link_berkas'],
                        'penerbit' => $row['penerbit'] ?? null,
                    ]
                );

                // Tidak menghapus penulis lain; hanya pastikan dosen ini tercatat sebagai penulis
                $luaranJurnal->penulis()->firstOrCreate(
                    ['dosen_id' => $dosen->id],
                    [
                        'fakultas_id' => $dosen->fakultas_id,
                        'urutan' => ($luaranJurnal->penulis()->max('urutan') ?? 0) + 1,
                    ]
                );
            }
        });
    }
}
