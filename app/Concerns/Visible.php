<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

trait Visible
{
    public function scopeVisibleTo(Builder $query, User $user): Builder
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
}
