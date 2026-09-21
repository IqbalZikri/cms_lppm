<?php

namespace Database\Seeders;

use App\Models\SiteSettings;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['setting_key' => 'nama_website', "setting_value" => "Lembaga Penjamin & Pengabdian Masyarakat - Universitas Cendekia Abditama"],
            ['setting_key' => 'deskripsi_website', "setting_value" => "Website Lembaga Penjamin & Pengabdian Masyarakat Universitas Cendekia Abditama"],
            ["setting_key" => "logo_url", "setting_value" => "/logo-uca-website.png"],
            ['setting_key' => 'facebook_url', 'setting_value' => null],
            ['setting_key' => 'instagram_url', 'setting_value' => null],
            ['setting_key' => 'twitter_url', 'setting_value' => null],
            ['setting_key' => 'telepon', 'setting_value' => '021-123456'],
            ['setting_key' => 'email', 'setting_value' => 'info@uca.ac.id'],
            ['setting_key' => 'alamat', 'setting_value' => 'Jl. Pendidikan No. 1, Jakarta'],
            ['setting_key' => 'whatsapp_number', 'setting_value' => '6281234567890'],
            [
                'setting_key' => 'vision',
                'setting_value' => 'Menjadi pusat unggulan pendidikan dan penelitian di bidang informatika yang berbasis nilai-nilai Islam pada tahun 2030.'
            ],
            [
                'setting_key' => 'mission',
                'setting_value' => "Menyelenggarakan pendidikan tinggi berkualitas yang berorientasi pada pengembangan ilmu pengetahuan dan teknologi.\nMelaksanakan penelitian inovatif yang berkontribusi pada pemecahan masalah di tingkat nasional maupun global.\nMengembangkan pengabdian kepada masyarakat yang relevan, berkelanjutan, dan berdampak positif.\nMewujudkan tata kelola perguruan tinggi yang profesional, transparan, dan berlandaskan nilai-nilai Islam."
            ],
        ];

        foreach ($settings as $setting) {
            SiteSettings::updateOrCreate(
                ['setting_key' => $setting['setting_key']],
                $setting
            );
        }
    }
}
