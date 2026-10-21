<?php

namespace App\Imports;

use App\Models\Dosen;
use App\Models\LuaranJurnal;
use App\Models\Penulis;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Log;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Validators\Failure;

class JurnalImport implements ToCollection, WithHeadingRow, SkipsOnFailure
{
    use Importable, SkipsFailures;

    private const JENIS_LUARAN = [
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
    ];

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

    private static function normalizeKey(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        // trim, rapikan spasi ganda/tab, lalu lowercase
        return strtolower(preg_replace('/\s+/', ' ', trim($value)));
    }

    public function rules(): array
    {
        return [
            'nidn' => ['required', 'array', 'min:1'],
            'nidn.*' => ['exists:dosens,nidn'],
            'jenis_luaran_jurnal' => ['required', Rule::in(self::JENIS_LUARAN)],
            'judul' => ['required', 'string'],
            'tahun' => ['required', 'digits:4'],
            'link_berkas' => ['required', 'url'],
        ];
    }

    public function prepareForValidation($data, $index)
    {
        $data['nidn'] = self::parseNidn($data['nidn'] ?? null); // sekarang berupa array
        $data['jenis_luaran_jurnal'] = self::normalizeKey($data['jenis_luaran_jurnal'] ?? null);

        return $data;
    }

    public function customValidationMessages()
    {
        return [
            'nidn.required' => 'NIDN tidak boleh kosong',
            'nidn.min' => 'NIDN tidak boleh kosong',
            'nidn.*.exists' => 'Dosen dengan NIDN :input tidak ditemukan',
            'jenis_luaran_jurnal.in' => 'Jenis luaran jurnal tidak valid',
            'judul.required' => 'Judul tidak boleh kosong',
            'tahun.digits' => 'Tahun harus 4 digit',
            'link_berkas.url' => 'Link berkas harus berupa URL valid',
        ];
    }

    public function collection(Collection $collection): void
    {
        $kolomData = ['nidn', 'jenis_luaran_jurnal', 'judul', 'tahun', 'link_berkas'];

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

                    $luaranJurnal = LuaranJurnal::updateOrCreate(
                        [
                            'user_id' => $pertama->user->id,
                            'judul' => $data['judul'],
                            'tahun' => $data['tahun'],
                        ],
                        [
                            'jenis_luaran_jurnal' => $data['jenis_luaran_jurnal'],
                            'abstrak' => $data['abstrak'] ?? '-',
                            'semester' => $data['semester'] ?? '-',
                            'link_berkas' => $data['link_berkas'],
                            'penerbit' => $data['penerbit'] ?? '-',
                            'diimport_oleh' => auth()->id(),
                        ]
                    );

                    // semua penulis sesuai urutan di Excel
                    foreach ($data['nidn'] as $nidn) {
                        $dosen = $dosens[$nidn];

                        $luaranJurnal->penulis()->firstOrCreate(
                            ['dosen_id' => $dosen->id],
                            [
                                'fakultas_id' => $dosen->fakultas_id,
                                'urutan' => ($luaranJurnal->penulis()->max('urutan') ?? 0) + 1,
                            ]
                        );
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
