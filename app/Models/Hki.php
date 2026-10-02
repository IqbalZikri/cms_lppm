<?php

namespace App\Models;

use App\Models\Concerns\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Hki extends Model
{
    use HasFactory, Searchable;

    protected array $searchable = [
        "jenis_hki",
        "judul",
        "tahun",
        "penulis.fakultas.nama_fakultas",
        "penulis.dosen.nama_dosen"
    ];

    protected $fillable = [
        'jenis_hki',
        'judul',
        'abstrak',
        'semester',
        'tahun',
        'link_berkas',
        'nomer_pengajuan_haki',
        'nomer_paten',
        'jumlah_dana',
        'sumber_dana',
    ];

    public function penulis(): MorphMany
    {
        return $this->morphMany(Penulis::class, 'penulisable')->orderBy('urutan');
    }
}
