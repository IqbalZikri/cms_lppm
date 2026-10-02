<?php

namespace Database\Factories;

use App\Models\Penulis;
use App\Models\Pkm;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pkm>
 */
class PkmFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'jenis_pkm' => fake()->randomElement(['pelaksanaan', 'jurnal']),
            'judul' => fake()->sentence(),
            'abstrak' => fake()->paragraph(),
            'semester' => fake()->randomElement(["ganjil", "genap"]),
            'tahun' => fake()->numberBetween(now()->subYears(3)->year, now()->year),
            'sumber_dana' => fake()->randomElement(["internal", "eksternal"]),
            'jumlah_dana' => fake()->numberBetween(5, 50) * 10000000,
            'link_berkas' => fake()->url,
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
