<?php

namespace App\Models;

use App\Concerns\FilterFakultas;
use App\Concerns\Visible;
use App\Models\Concerns\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class LuaranJurnal extends Model
{
    use HasFactory, Searchable, SoftDeletes, Visible, FilterFakultas;

    protected array $searchable = [
        "jenis_luaran_jurnal",
        "judul",
        "tahun",
        "penulis.fakultas.nama_fakultas",
        "penulis.dosen.nama_dosen",
        "penulisLuar.nama_universitas",
        "penulisLuar.nama_dosen",
    ];

    protected $fillable = [
        'jenis_luaran_jurnal',
        'judul',
        'abstrak',
        'semester',
        'tahun',
        'link_berkas',
        'penerbit',
        'user_id',
        'diimport_oleh'
    ];

    public function diimport()
    {
        return $this->belongsTo(User::class, 'diimport_oleh');
    }

    public function penulis(): MorphMany
    {
        return $this->morphMany(Penulis::class, 'penulisable')->orderBy('urutan');
    }

    public function penulisLuar(): MorphMany
    {
        return $this->morphMany(PenulisLuar::class, 'penulisable_luar')->orderBy('urutan');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
