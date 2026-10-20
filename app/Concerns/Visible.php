<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

trait Visible
{
    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        $model = $query->getModel();
        $hasStatus = static::hasStatusColumn();

        // Nama kolom diberi prefix tabel agar tidak ambigu saat ada join.
        $userColumn = $model->qualifyColumn('user_id');
        $statusColumn = $model->qualifyColumn('status_pengajuan');

        // Hanya dipanggil kalau $hasStatus true, jadi kolom pasti ada.
        $notDraft = fn (Builder $q) => $q
            ->whereNull($statusColumn)
            ->orWhere($statusColumn, '!=', 'draft');

        return match ($user->role) {
            'admin' => $query,

            // Punya sendiri ATAU yang bukan draft.
            // Tanpa kolom status: semua terlihat.
            'dosen' => $hasStatus
                ? $query->where(fn ($q) => $q
                    ->where($userColumn, $user->id)
                    ->orWhere($notDraft))
                : $query,

            // Punya sendiri ATAU (bukan draft, kalau ada kolom status)
            // dan penulisnya satu fakultas.
            'uppm' => $query->where(fn ($q) => $q
                ->where($userColumn, $user->id)
                ->orWhere(fn ($q) => $q
                    ->when($hasStatus, fn ($q) => $q->where($notDraft))
                    ->whereHas('penulis', fn ($p) => $p->where('fakultas_id', $user->fakultas_id)))),

            default => $query->whereRaw('1 = 0'),
        };
    }

    protected static function hasStatusColumn(): bool
    {
        static $cache = [];

        $model = new static;
        $table = $model->getTable();

        // Cache per koneksi + tabel, supaya tidak query schema berulang.
        $key = $model->getConnectionName().'.'.$table;

        return $cache[$key] ??= $model->getConnection()
            ->getSchemaBuilder()
            ->hasColumn($table, 'status_pengajuan');
    }
}