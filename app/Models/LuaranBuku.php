<?php

namespace App\Models;

use App\Models\Concerns\Searchable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class LuaranBuku extends Model
{
    use Searchable;

    protected $fillable = [
        "judul",
        "isbn",
        "tahun",
        "link_berkas",
    ];

    public function penulis(): MorphMany
    {
        return $this->morphMany(Penulis::class, 'penulisable')->orderBy('urutan');
    }

    public function penulisLuar(): MorphMany
    {
        return $this->morphMany(PenulisLuar::class, 'penulisable_luar')->orderBy("urutan");
    }
}
