<?php

namespace App\Actions;

use Illuminate\Database\Eloquent\Model;

class SyncAuthors
{
    public function handle(Model $model, array $authors): void
    {
        $model->penulis()->forceDelete();
        $model->penulisLuar()->forceDelete();

        foreach (array_values($authors) as $i => $author) {
            $urutan = $i + 1;

            if ($author['tipe'] === 'internal') {
                $model->penulis()->create([
                    'fakultas_id' => $author['fakultas_id'],
                    'dosen_id' => $author['dosen_id'],
                    'urutan' => $urutan,
                ]);
            } else {
                $model->penulisLuar()->create([
                    'nama_universitas' => $author['nama_universitas'],
                    'nama_dosen' => $author['nama_dosen'],
                    'urutan' => $urutan,
                ]);
            }
        }
    }
}
