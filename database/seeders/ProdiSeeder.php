<?php

namespace Database\Seeders;

use App\Models\Prodi;
use Illuminate\Database\Seeder;

class ProdiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Prodi::insert([
            'fakultas_id' => 1,
            'kode_prodi' => 01,
            'nama_prodi' => 'Elektro',
        ]);
    }
}
