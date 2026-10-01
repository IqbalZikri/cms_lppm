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
            'fakultas_id' => Fakultas::pluck('id')->random(),
            'prodi_id' => Prodi::pluck('id')->random(),
            'nidn' => fake()->unique()->numerify('##########'),
            'nuptk' => fake()->unique()->numerify('################'),
            'nama_dosen' => User::pluck('name')->random(),
            'jenis_kelamin' => fake()->randomElement(['L', 'P']),
            'tanggal_lahir' => fake()->date(),
            'tempat_lahir' => fake()->city(),
            'alamat' => fake()->address(),
            'hp' => fake()->phoneNumber(),
            'email' => User::pluck('email')->random(),
            'user_id' => User::pluck('id')->random(),
        ];
    }
}
