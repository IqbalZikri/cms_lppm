<?php

namespace App\Models;

use App\Models\Concerns\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dosen extends Model
{
    use HasFactory, Searchable;

    protected array $searchable = [
        'nama_dosen',
        'nidn',
        'nuptk',
        'email',
        'fakultas.nama_fakultas', // sesuaikan nama kolom di tabel fakultas
        'prodi.nama_prodi',       // sesuaikan nama kolom di tabel prodi
    ];

    protected $fillable = [
        'fakultas_id',
        'prodi_id',
        'nidn',
        'nuptk',
        'nama_dosen',
        'jenis_kelamin',
        'tanggal_lahir',
        'tempat_lahir',
        'alamat',
        'hp',
        'email',
        'foto',
        'user_id',
    ];

    public function fakultas()
    {
        return $this->belongsTo(Fakultas::class);
    }

    public function prodi()
    {
        return $this->belongsTo(Prodi::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function penulis()
    {
        return $this->hasMany(Penulis::class);
    }
}
