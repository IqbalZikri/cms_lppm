<?php

namespace Database\Factories;

use App\Models\LuaranBuku;
use App\Models\Penulis;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LuaranBuku>
 */
class LuaranBukuFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'judul' => fake()->sentence(),
            'isbn' => fake()->numberBetween(0, 100),
            'tahun' => fake()->numberBetween(now()->subYears(3)->year, now()->year),
            'link_berkas' => fake()->url(),
        ];
    }

    public function denganPenulis(int $jumlah = 3): static
    {
        return $this->has(
            Penulis::factory()
                ->count($jumlah)
                ->sequence(fn($seq) => ['urutan' => $seq->index + 1]),
            'penulis'
        );
    }
}
