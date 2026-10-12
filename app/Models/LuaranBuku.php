<?php

namespace App\Models;

use App\Models\Concerns\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class LuaranBuku extends Model
{
    use Searchable, HasFactory;

    protected $fillable = [
        "judul",
        "isbn",
        "tahun",
        "link_berkas",
        "user_id"
    ];

    public function penulis(): MorphMany
    {
        return $this->morphMany(Penulis::class, 'penulisable')->orderBy('urutan');
    }

    public function penulisLuar(): MorphMany
    {
        return $this->morphMany(PenulisLuar::class, 'penulisable_luar')->orderBy("urutan");
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
