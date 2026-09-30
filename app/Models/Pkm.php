<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Pkm extends Model
{
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
