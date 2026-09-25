<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Kegiatan extends Model
{
    protected $fillable = [
        'judul_kegiatan',
        'abstrak',
        'semester',
        'tahun',
        'link_berkas',
        'sumber_dana',
        'jumlah_dana',
        'penulis',
    ];

    public function penulis(): MorphMany
    {
        return $this->morphMany(Penulis::class, 'penulisable')->orderBy('urutan');
    }

    protected $casts = [
        'penulis' => 'array',
    ];
}
