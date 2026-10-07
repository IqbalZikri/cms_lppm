<?php

namespace App\Models;

use App\Models\Concerns\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class LuaranProsiding extends Model
{
    use HasFactory, Searchable;

    protected array $searchable = [
        "judul",
        "tahun",
        "penulis.fakultas.nama_fakultas",
        "penulis.dosen.nama_dosen",
        "penulisLuar.nama_universitas",
        "penulisLuar.nama_dosen",
    ];

    protected $fillable = [
        'judul',
        'abstrak',
        'semester',
        'tahun',
        'link_berkas',
    ];

    public function penulis(): MorphMany
    {
        return $this->morphMany(Penulis::class, 'penulisable')->orderBy('urutan');
    }

    public function penulisLuar(): MorphMany
    {
        return $this->morphMany(PenulisLuar::class, 'penulisable_luar')->orderBy('urutan');
    }
}
