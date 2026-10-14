<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class DosenPreviewImport implements ToCollection, WithHeadingRow
{
    public array $rows = [];

    public function collection(Collection $collection): void
    {
        $import = new DosenImport();
        $rules = $import->rules();
        $messages = $import->customValidationMessages();

        foreach ($collection->values() as $i => $row) {
            $data = $row->toArray();

            $validator = Validator::make($data, $rules, $messages);

            $this->rows[] = [
                'row'    => $i + 2, // baris 1 = heading
                'data'   => $data,
                'errors' => $validator->errors()->all(),
            ];
        }
    }
}