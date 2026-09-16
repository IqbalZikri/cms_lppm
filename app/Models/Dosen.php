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
        'email',
        'id_penelitian',
        'id_fakultas',
        'id_users',
    ];

    // public function penelitian(){
    //     return $this->belongsTo(Penelit)
    // }
}
