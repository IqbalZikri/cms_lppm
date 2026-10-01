<?php

namespace Database\Factories;

use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Penulis;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Penulis>
 */
class PenulisFactory extends Factory
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
            'dosen_id' => Dosen::pluck('id')->random(),
            'urutan' => 1,
        ];
    }
}
