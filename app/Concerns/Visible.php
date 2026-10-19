<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;

trait Visible
{
    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        $hasStatus = static::hasStatusColumn();

        $notDraft = fn ($q) => $q
            ->whereNull('status_pengajuan')
            ->orWhere('status_pengajuan', '!=', 'draft');

        return match ($user->role) {
            'admin' => $query,

            // punya sendiri ATAU yang bukan draft (tanpa kolom status: semua terlihat)
            'dosen' => $hasStatus
                ? $query->where(fn ($q) => $q
                    ->where('user_id', $user->id)
                    ->orWhere($notDraft))
                : $query,

            'uppm' => $query->where(fn ($q) => $q
                ->where('user_id', $user->id)
                ->orWhere(fn ($q) => $q
                    ->when($hasStatus, fn ($q) => $q->where($notDraft))
                    ->whereHas('penulis', fn ($p) => $p->where('fakultas_id', $user->fakultas_id)))),

            default => $query->whereRaw('1 = 0'),
        };
    }

    protected static function hasStatusColumn(): bool
    {
        static $cache = [];

        $table = (new static)->getTable();

        return $cache[$table] ??= Schema::hasColumn($table, 'status_pengajuan');
    }
}