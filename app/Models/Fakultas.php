<?php

namespace App\Models;

use App\Models\Concerns\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fakultas extends Model
{
    use HasFactory, Searchable;

    protected array $searchable = [
        'kode_fakultas',
        'nama_fakultas'
    ];
    
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
