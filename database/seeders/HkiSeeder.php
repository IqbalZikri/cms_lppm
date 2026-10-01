<?php

namespace Database\Seeders;

use App\Models\Hki;
use App\Models\Penulis;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HkiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Hki::factory()
            ->has(
                Penulis::factory()
                    ->count(3)
                    ->sequence(fn($seq) => ['urutan' => $seq->index + 1]),
                'penulis' // nama method relasi di model Kegiatan
            )
            ->count(20)->create();
    }
}
