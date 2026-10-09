<?php

namespace App\Models;
use App\Models\Concerns\Searchable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Berita extends Model
{
    use SoftDeletes, Searchable;

    protected array $searchable = [
        'judul_berita',
        'views',
        'status_published',
        'published_at',
        'deleted',
        'user_id',
        'kategori.nama_kategori',
    ];

    protected $fillable = [
        'kategori_id',
        'judul_berita',
        'ringkasan_berita',
        'isi_berita',
        'views',
        'gambar',
        'status_published',
        'slug',
        'published_at',
        'deleted_at',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function kategori()
    {
        return $this->belongsTo(Kategori::class);
    }

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    public function scopeTayang(Builder $query): Builder
    {
        return $query
            ->where('status_published', 'published') // sesuaikan dengan nilai asli di database
            ->where(function ($q) {
                $q->whereNull('published_at')->orWhere('published_at', '<=', now());
            });
    }

    private function beritaTayang()
    {
        return Berita::with('kategori:id,nama_kategori')->tayang();
    }
}
