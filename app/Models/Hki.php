<?php

namespace App\Models;

use App\Concerns\FilterFakultas;
use App\Concerns\Visible;
use App\Enums\StatusPengajuan;
use App\Models\Concerns\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hki extends Model
{
    use HasFactory, Searchable, Visible, FilterFakultas, SoftDeletes;

    protected array $searchable = [
        "jenis_hki",
        "judul",
        "tahun",
        "penulis.fakultas.nama_fakultas",
        "penulis.dosen.nama_dosen",
        "penulisLuar.nama_universitas",
        "penulisLuar.nama_dosen",
    ];

    protected $fillable = [
        'jenis_hki',
        'judul',
        'abstrak',
        'semester',
        'tahun',
        'link_berkas',
        'nomer_pengajuan_haki',
        'nomer_paten',
        'jumlah_dana',
        'sumber_dana',
        'status_pengajuan',
        'user_id',
    ];

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

    protected function casts(): array
    {
        return [
            'status_pengajuan' => StatusPengajuan::class,
            'tahun' => 'integer',
        ];
    }
}
