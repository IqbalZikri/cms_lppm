<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PenulisLuar extends Model
{
    use SoftDeletes;
    
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
