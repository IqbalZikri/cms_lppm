<?php

namespace Database\Seeders;

use App\Models\LuaranBuku;
use App\Models\Penulis;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LuaranBukuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LuaranBuku::factory()
            ->has(
                Penulis::factory()
                    ->count(3)
                    ->sequence(fn($seq) => ['urutan' => $seq->index + 1]),
                'penulis'
            )
            ->count(20)->create();
    }
}
