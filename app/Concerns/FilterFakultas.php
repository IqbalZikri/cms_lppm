<?php

namespace App\Concerns;

use Illuminate\Database\Eloquent\Builder;

trait FilterFakultas
{
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['cari_fakultas'] ?? null, fn($q, $fakultasId) =>
                $q->whereHas('penulis', fn($p) => $p->withTrashed()->where('fakultas_id', $fakultasId)))
            ->search($filters['search'] ?? null);
    }
}
