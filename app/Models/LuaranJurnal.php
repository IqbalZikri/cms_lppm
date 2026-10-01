<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class LuaranJurnal extends Model
{
    use HasFactory;
    protected $fillable = [
        'jenis_luaran_jurnal',
        'judul',
        'slug',
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
