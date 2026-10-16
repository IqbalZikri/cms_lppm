<?php

namespace App\Models;

use App\Models\Concerns\Searchable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kegiatan extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected array $searchable = [
        'judul',
        'tahun',
        'penulis.fakultas.nama_fakultas',
        'penulis.dosen.gelar_depan',
        'penulis.dosen.nama_dosen',
        'penulis.dosen.gelar_belakang',
        'penulisLuar.nama_universitas',
        'penulisLuar.nama_dosen',
    ];

    protected $fillable = [
        'judul',
        'abstrak',
        'semester',
        'tahun',
        'link_berkas',
        'sumber_dana',
        'jumlah_dana',
        'user_id',
    ];

    public function scopeVisibleTo(Builder $query, User $user, Dosen $dosen = null): Builder
    {
        return match ($user->role) {
            'admin' => $query,
            'dosen' => $query->where(fn($q) => $q->where('user_id', $user->id)),
            'uppm' => $query->where(fn($q) => $q
                ->where('user_id', $user->id)
                ->orWhereHas('penulis', fn($p) => $p->where('fakultas_id', $user->fakultas_id))),
            default => $query->whereRaw('1 = 0'), // role tak dikenal: tidak lihat apa pun
        };
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['cari_fakultas'] ?? null, fn($q, $fakultasId) =>
                $q->whereHas('penulis', fn($p) => $p->withTrashed()->where('fakultas_id', $fakultasId)))
            ->search($filters['search'] ?? null);
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
