<?php

namespace App\Models;

use App\Models\Concerns\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Pkm extends Model
{
    use HasFactory, Searchable;

    protected array $searchable = [
        'judul',
        'penulis.fakultas.nama_fakultas',
        'penulis.dosen.nama_dosen',
        'penulis.nama_universitas',
        'penulis.nama_dosen',
    ];
    protected $fillable = [
        'jenis_pkm',
        'judul',
        'abstrak',
        'semester',
        'tahun',
        'sumber_dana',
        'jumlah_dana',
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
