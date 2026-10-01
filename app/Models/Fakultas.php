<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fakultas extends Model
{
    use HasFactory;
    protected $fillable = [
        'kode_fakultas',
        'nama_fakultas',
    ];

    public function dosen()
    {
        return $this->hasMany(Dosen::class);
    }

    public function penulis()
    {
        return $this->hasMany(Penulis::class);
    }
}
