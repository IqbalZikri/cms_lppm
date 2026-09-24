<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Penulis extends Model
{
    protected $table = 'penulis';
    protected $fillable = [
        'fakultas_id',
        'dosen_id',
        'nama_fakultas',
        'nama_dosen',
        'urutan',
    ];


    public function penulisable(): MorphTo
    {
        return $this->morphTo();
    }

    public function dosen(): BelongsTo
    {
        return $this->belongsTo(Dosen::class);
    }

    public function fakultas(): BelongsTo
    {
        return $this->belongsTo(Fakultas::class);
    }
}
