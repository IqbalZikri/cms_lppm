<?php

namespace Database\Seeders;

use App\Models\Dosen;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DosenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Dosen::insert([
            'fakultas_id' => 1,
            'prodi_id' => 1,
            'nidn' => "123",
            'nuptk' => "123",
            'nama_dosen' => "Bambang",
            'jenis_kelamin' => "L",
            'tanggal_lahir' => fake()->date(),
            'tempat_lahir' => fake()->text(),
            'alamat' => fake()->streetAddress(),
            'hp' => fake()->phoneNumber(),
            'email' => fake()->email(),
            'user_id' => 2,
        ]);
    }
}
