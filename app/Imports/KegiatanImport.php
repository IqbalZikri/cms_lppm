<?php

namespace App\Imports;

use App\Models\Dosen;
use App\Models\Kegiatan;
use App\Models\PenulisLuar;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Validators\Failure;

class KegiatanImport implements ToCollection, WithHeadingRow, SkipsOnFailure
{
    use Importable, SkipsFailures;

    private const SEMESTER = [
        'ganjil',
        'genap'
    ];

    private const SUMBERDANA = [
        'internal',
        'eksternal'
    ];

    private static function normalizeKey(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        // trim, rapikan spasi ganda/tab, lalu lowercase
        return strtolower(preg_replace('/\s+/', ' ', trim($value)));
    }

    private static function parseNidn($value): array
    {
        if (is_array($value)) {
            return $value;
        }

        if ($value === null || $value === '') {
            return [];
        }

        $parts = preg_split('/[\s,;]+/', trim((string) $value), -1, PREG_SPLIT_NO_EMPTY);

        return array_values(array_unique($parts));
    }

    private static function parseList($value): array
    {
        if (is_array($value)) {
            return $value;
        }

        if ($value === null || trim((string) $value) === '') {
            return [];
        }

        $parts = preg_split('/[;|\n]+/', (string) $value, -1, PREG_SPLIT_NO_EMPTY);

        // trim tiap item, buang yang kosong, tetap pertahankan urutan
        return array_values(array_filter(array_map('trim', $parts), fn($v) => $v !== ''));
    }

    public function rules(): array
    {
        return [
            'nidn' => ['required', 'array', 'min:1'],
            'nidn.*' => ['exists:dosens,nidn'],
            'judul' => ['required', 'string'],
            'semester' => ['required', Rule::in(self::SEMESTER)],
            'tahun' => ['required', 'digits:4'],
            'link_berkas' => ['required', 'url'],
            'sumber_dana' => ['required', Rule::in(self::SUMBERDANA)],
            'jumlah_dana' => ['required']
        ];
    }

    public function prepareForValidation($data, $index)
    {
        $data['nidn'] = self::parseNidn($data['nidn'] ?? null); 
        $data['semester'] = self::normalizeKey($data['semester'] ?? null);
        $data['sumber_dana'] = self::normalizeKey($data['sumber_dana'] ?? null);

        $data['nama_universitas'] = self::parseList($data['nama_universitas'] ?? null);
        $data['nama_dosen'] = self::parseList($data['nama_dosen'] ?? null);

        return $data;
    }

    public function customValidationMessages()
    {
        return [
            'nidn.required' => 'NIDN tidak boleh kosong',
            'nidn.min' => 'NIDN tidak boleh kosong',
            'nidn.*.exists' => 'Dosen dengan NIDN :input tidak ditemukan',
            'judul.required' => 'Judul tidak boleh kosong',
            'tahun.digits' => 'Tahun harus 4 digit',
            'link_berkas.url' => 'Link berkas harus berupa URL valid',
            'sumber_dana.required' => 'Sumber dana wajib diisi',
            'jumlah_dana.required' => 'Jumlah dana wajib diisi',
        ];
    }

    public function collection(Collection $collection): void
    {
        $kolomData = ['nidn', 'judul', 'semester', 'tahun', 'link_berkas'];

        $rows = $collection->filter(function ($row) use ($kolomData) {
            return collect($kolomData)->contains(fn($k) => filled($row[$k] ?? null));
        });

        try {
            DB::transaction(function () use ($rows) {
                foreach ($rows as $index => $row) {
                    $data = $this->prepareForValidation($row->toArray(), $index);
                    $validator = Validator::make($data, $this->rules(), $this->customValidationMessages());

                    if ($validator->fails()) {
                        foreach ($validator->errors()->messages() as $attribute => $errors) {
                            // "nidn.1" dijadikan "nidn" agar kolom error di preview tetap sesuai
                            $kolom = explode('.', $attribute)[0];
                            $this->onFailure(new Failure($index + 2, $kolom, $errors, $row->toArray()));
                        }
                        continue;
                    }

                    // ambil semua dosen sekaligus (1 query), kunci berdasarkan NIDN
                    $dosens = Dosen::with('user')->whereIn('nidn', $data['nidn'])->get()->keyBy('nidn');

                    // penulis pertama = pemilik data, wajib punya akun user
                    $pertama = $dosens[$data['nidn'][0]];

                    if (!$pertama->user) {
                        $this->onFailure(new Failure(
                            $index + 2,
                            'nidn',
                            ["Dosen pertama (NIDN {$pertama->nidn}) belum memiliki akun user"],
                            $row->toArray()
                        ));
                        continue;
                    }

                    $kegiatan = Kegiatan::updateOrCreate(
                        [
                            'user_id' => $pertama->user->id,
                            'judul' => $data['judul'],
                            'tahun' => $data['tahun'],
                        ],
                        [
                            'abstrak' => $data['abstrak'] ?? '-',
                            'semester' => $data['semester'] ?? '-',
                            'link_berkas' => $data['link_berkas'],
                            'sumber_dana' => $data['sumber_dana'],
                            'jumlah_dana' => $data['jumlah_dana'],
                            'diimport_oleh' => auth()->user()->id,
                        ]
                    );

                    $kegiatan->penulis()->forceDelete();
                    $kegiatan->penulisLuar()->forceDelete();

                    // semua penulis sesuai urutan di Excel
                    foreach ($data['nidn'] as $nidn) {
                        $dosen = $dosens[$nidn];

                        $kegiatan->penulis()->firstOrCreate(
                            ['dosen_id' => $dosen->id],
                            [
                                'fakultas_id' => $dosen->fakultas_id,
                                'urutan' => ($kegiatan->penulis()->max('urutan') ?? 0) + 1,
                            ]
                        );
                    }

                    foreach ($data['nama_universitas'] as $i => $namaUniversitas) {
                        $kegiatan->penulisLuar()->create([
                            'nama_universitas' => $namaUniversitas,
                            'nama_dosen' => $data['nama_dosen'][$i],
                            'urutan' => count($data['nidn']) + $i + 1,
                        ]);
                    }
                }
            });
        } catch (\Exception $e) {
            Log::error('Transaksi gagal: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            throw $e;
        }
    }
}
