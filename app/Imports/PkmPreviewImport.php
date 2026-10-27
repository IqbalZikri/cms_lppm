<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class PkmPreviewImport implements ToCollection, WithHeadingRow
{
    public array $rows = [];

    public function collection(Collection $collection): void
    {
        $import = new KegiatanImport();
        $rules = $import->rules();
        $messages = $import->customValidationMessages();

        $kolomData = ['nidn', 'jenis_pkm', 'judul', 'semester', 'tahun', 'link_berkas', 'sumber_dana', 'jumlah_dana', 'penulis_luar_universitas', 'nama_universitas', 'nama_dosen'];

        $rows = $collection->filter(function ($row) use ($kolomData) {
            return collect($kolomData)->contains(fn($k) => filled($row[$k] ?? null));
        });

        foreach ($rows as $i => $row) {
            $data = $import->prepareForValidation($row->toArray(), $i);

            $validator = Validator::make($data, $rules, $messages);

            $this->rows[] = [
                'row' => $i + 2, // baris 1 = heading
                'data' => $data,
                'errors' => $validator->errors()->all(),
            ];
        }
    }
}
