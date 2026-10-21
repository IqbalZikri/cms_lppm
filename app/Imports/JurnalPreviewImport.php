<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class JurnalPreviewImport implements ToCollection, WithHeadingRow
{
    public array $rows = [];

    public function collection(Collection $collection): void
    {
        $import = new JurnalImport();
        $rules = $import->rules();
        $messages = $import->customValidationMessages();

        $kolomData = ['nidn', 'jenis_luaran_jurnal', 'judul', 'tahun', 'link_berkas','nama_universitas','nama_dosen'];

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
