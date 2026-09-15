<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dosen extends Model
{
    protected $fillable = [
        'nidn',
        'nuptk',
        'nama_dosen',
        'jenis_kelamin',
        'tanggal_lahir',
        'tempat_lahir',
        'alamat',
        'hp',
        'id_penelitian',
        'id_fakultas',
        'id_users',
    ];
}
