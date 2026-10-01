<?php

namespace Database\Factories;

use App\Models\Kegiatan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Kegiatan>
 */
class KegiatanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'judul' => fake()->name(),
            'slug' => fake()->name(),
            'abstrak' => fake()->name(),
            'semester' => fake()->randomElement(["Ganjil", "Genap"]),
            'tahun' => fake()->year(),
            'link_berkas' => fake()->li,
            'sumber_dana',
            'jumlah_dana',
        ];
    }
}
