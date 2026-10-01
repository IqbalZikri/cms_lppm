<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Penulis extends Model
{
    use HasFactory;
    protected $table = 'penulis';
    protected $fillable = [
        'fakultas_id',
        'dosen_id',
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
