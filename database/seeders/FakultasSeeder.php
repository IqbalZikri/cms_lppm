<?php

namespace Database\Seeders;

use App\Models\Fakultas;
use Illuminate\Database\Seeder;

class FakultasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Fakultas::insert([
            [
                'nama_fakultas' => 'Teknik dan Ilmu Komputer',
            ],
            [
                'nama_fakultas' => 'Ekonomi dan BIsnis Islam',
            ],
            [
                'nama_fakultas' => 'Tabriyah dan Ilmu Keguruan',
            ],
            [
                'nama_fakultas' => 'Ilmu Kesehatan',
            ]
        ]);

        // Fakultas::factory()->count(10)->create();
    }
}
