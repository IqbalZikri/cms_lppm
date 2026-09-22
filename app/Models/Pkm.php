<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pkm extends Model
{
    protected $fillable = [
        'jenis_pkm',
        'judul',
        'abstrak',
        'semester',
        'tahun',
        'sumber_dana',
        'jumlah_dana',
        'link_berkas',
        'pelaksana',
    ];
}
