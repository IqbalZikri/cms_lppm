<?php

namespace Database\Factories;

use App\Models\LuaranProsiding;
use App\Models\Penulis;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LuaranProsiding>
 */
class LuaranProsidingFactory extends Factory
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
            'slug' => fake()->unique()->slug(),
            'abstrak' => fake()->paragraph(),
            'semester' => fake()->randomElement(["Ganjil", "Genap"]),
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
