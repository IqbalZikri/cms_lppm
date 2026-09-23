<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

    public function fakultas(){
        return $this->belongsTo(Fakultas::class);
    }

    public function dosen(){
        return $this->belongsTo(Dosen::class);
    }
}
