<?php

namespace App\Models;

use App\Models\Concerns\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prodi extends Model
{
    use HasFactory, Searchable;

    protected array $searchable = [
        "fakultas.nama_fakultas",
        "nama_prodi"
    ];
    protected $fillable = [
        'fakultas_id',
        'nama_prodi',
    ];

    public function fakultas()
    {
        return $this->belongsTo(Fakultas::class);
    }
}
