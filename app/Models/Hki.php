<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Hki extends Model
{
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
