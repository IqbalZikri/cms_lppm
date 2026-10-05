<?php

namespace Database\Seeders;

use App\Models\Kegiatan;
use App\Models\Penulis;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KegiatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Kegiatan::factory()
            ->has(
                Penulis::factory()
                    ->count(3)
                    ->sequence(fn($seq) => ['urutan' => $seq->index + 1]),
                'penulis' // nama method relasi di model Kegiatan
            )
            ->count(100)->create();
    }
}
