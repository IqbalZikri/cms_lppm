<?php

namespace App\Models;

use App\Models\Concerns\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class LuaranJurnal extends Model
{
    use HasFactory, Searchable;

    protected array $searchable = [
        "jenis_luaran_jurnal",
        "judul",
        "tahun",
        "penulis.fakultas.nama_fakultas",
        "penulis.dosen.nama_dosen"
    ];

    protected $fillable = [
        'jenis_luaran_jurnal',
        'judul',
        'abstrak',
        'semester',
        'tahun',
        'link_berkas'
    ];

    public function penulis(): MorphMany
    {
        return $this->morphMany(Penulis::class, 'penulisable')->orderBy('urutan');
    }
}
