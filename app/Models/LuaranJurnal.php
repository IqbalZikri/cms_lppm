<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class LuaranJurnal extends Model
{
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
