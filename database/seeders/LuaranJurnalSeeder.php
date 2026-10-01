<?php

namespace Database\Seeders;

use App\Models\LuaranJurnal;
use App\Models\Penulis;
use Illuminate\Database\Seeder;

class LuaranJurnalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LuaranJurnal::factory()
            ->has(
                Penulis::factory()
                    ->count(3)
                    ->sequence(fn($seq) => ['urutan' => $seq->index + 1]),
                'penulis' // nama method relasi di model Kegiatan
            )
            ->count(20)->create();
    }
}
