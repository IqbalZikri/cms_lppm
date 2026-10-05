<?php

namespace App\Models;

use App\Models\Concerns\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Kegiatan extends Model
{
    use HasFactory, Searchable;

    protected array $searchable = [
        'judul',
        'tahun',
        'penulis.fakultas.nama_fakultas',
        'penulis.dosen.nama_dosen'
    ];

    protected $fillable = [
        'judul',
        'abstrak',
        'semester',
        'tahun',
        'link_berkas',
        'sumber_dana',
        'jumlah_dana',
    ];

    public function penulis(): MorphMany
    {
        return $this->morphMany(Penulis::class, 'penulisable')->orderBy('urutan');
    }
}
