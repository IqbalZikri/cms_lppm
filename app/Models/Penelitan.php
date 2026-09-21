<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penelitan extends Model
{
    protected $fillable = [
        'dosen_id',
        'judu_penelitian',
        'abstrak',
        'semester',
        'tahun',
        'dana',
        'sumber_dana',
        'jumlah_dana'
    ];

    public function dosen()
    {
        return $this->belongsTo(Dosen::class);
    }
}
