<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penulis extends Model
{
    protected $fillable = [
        'kegiatans_id',
        'pkms_id',
        'hkis_id',
        'luaran_prosidings_id',
        'luaran_jurnals_id',
        'fakultas_id',
        'dosen_id',
    ];

    public function kegiatan()
    {
        return $this->belongsTo(Kegiatan::class);
    }

    public function pkm()
    {
        return $this->belongsTo(Pkm::class);
    }

    public function hki()
    {
        return $this->belongsTo(Hki::class);
    }

    public function luaranProsiding()
    {
        return $this->belongsTo(LuaranProsiding::class);
    }

    public function luaranJurnal()
    {
        return $this->belongsTo(LuaranJurnal::class);
    }

    public function fakultas()
    {
        return $this->belongsTo(Fakultas::class);
    }

    public function dosen()
    {
        return $this->belongsTo(Dosen::class);
    }
}
