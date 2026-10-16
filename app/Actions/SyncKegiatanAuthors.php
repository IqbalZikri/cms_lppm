<?php

namespace App\Actions;

use App\Models\Kegiatan;

class SyncKegiatanAuthors
{
    public function handle(Kegiatan $kegiatan, array $authors): void
    {
        $kegiatan->penulis()->forceDelete();
        $kegiatan->penulisLuar()->forceDelete();

        foreach ($authors as $i => $author) {
            $urutan = $i + 1;

            if ($author['tipe'] === 'internal') {
                $kegiatan->penulis()->create([
                    'fakultas_id' => $author['fakultas_id'],
                    'dosen_id' => $author['dosen_id'],
                    'urutan' => $urutan,
                ]);
            } else {
                $kegiatan->penulisLuar()->create([
                    'nama_universitas' => $author['nama_universitas'],
                    'nama_dosen' => $author['nama_dosen'],
                    'urutan' => $urutan,
                ]);
            }
        }
    }
}
