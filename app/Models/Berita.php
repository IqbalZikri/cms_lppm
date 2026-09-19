<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Berita extends Model
{
    use Searchable;
    use SoftDeletes;

    protected array $searchable = [
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
}
