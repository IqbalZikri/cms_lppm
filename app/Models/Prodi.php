<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prodi extends Model
{
    use HasFactory;
    protected $fillable = [
        'fakultas_id',
        'kode_prodi',
        'nama_prodi',
    ];

    public function fakultas()
    {
        return $this->hasMany(Fakultas::class);
    }
}
