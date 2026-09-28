<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class LuaranProsiding extends Model
{
    protected $fillable = [
        'judul',
        'slug',
        'abstrak',
        'semester',
        'tahun',
        'link_berkas',
        'penulis',
    ];

    public function penulis(): MorphMany
    {
        return $this->morphMany(Penulis::class, 'penulisable')->orderBy('urutan');
    }
}
