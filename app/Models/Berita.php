<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Berita extends Model
{
    use SoftDeletes;
    protected $fillable = [
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
}
