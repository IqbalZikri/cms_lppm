<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class PenulisLuar extends Model
{
    protected $fillable = [
        "nama_universitas",
        "nama_dosen",
        "urutan"
    ];

    public function penulisable(): MorphTo
    {
        return $this->morphTo();
    }
}
