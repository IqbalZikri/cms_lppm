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
        'penulis.dosen.nama_dosen'
    ];
    protected $fillable = [
        'jenis_pkm',
        'judul',
        'slug',
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

    protected $casts = [
        'penulis' => 'array',
    ];
}
