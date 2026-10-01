<?php

namespace Database\Factories;

use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Dosen>
 */
class DosenFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'fakultas_id' => Fakultas::factory(),
            'prodi_id' => Prodi::factory(),
            'nidn' => fake()->numberBetween(0, 20),
            'nuptk' => fake()->numberBetween(0, 20),
            'nama_dosen' => fake()->name(),
            'jenis_kelamin' => fake()->randomElement(["L", "P"]),
            'tanggal_lahir' => fake()->date(),
            'tempat_lahir' => fake()->address(),
            'alamat' => fake()->address(),
            'hp' => fake()->phoneNumber(),
            'email' => fake()->email(),
            'user_id' => User::factory(),
        ];
    }
}
