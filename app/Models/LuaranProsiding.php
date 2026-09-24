<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LuaranProsiding extends Model
{
    protected $fillable = [
        'judul',
        'abstrak',
        'semester',
        'tahun',
        'link_berkas',
        'penulis',
    ];

    protected $casts = [
        'penulis' => 'array',
    ];
}
