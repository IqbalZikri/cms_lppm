<?php

namespace App\Policies;

use App\Models\Kegiatan;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class KegiatanPolicy
{
    private const ROLES = ["admin", "dosen", "uppm"];

    public function before(User $user, string $ability): ?bool
    {
        return $user->role === 'admin' ? true : null;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, self::ROLES, true);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Kegiatan $kegiatan): bool
    {
        return Kegiatan::withTrashed()
            ->visibleTo($user)
            ->whereKey($kegiatan->id)
            ->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, self::ROLES, true);
    }

    public function edit(User $user): bool
    {
        return in_array($user->role, self::ROLES, true);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Kegiatan $kegiatan): bool
    {
        return !$kegiatan->trashed() && $kegiatan->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Kegiatan $kegiatan): bool
    {
        return $this->update($user, $kegiatan);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Kegiatan $kegiatan): bool
    {
        return $kegiatan->trashed() && $kegiatan->user_id === $user->id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Kegiatan $kegiatan): bool
    {
        return $kegiatan->trashed() && $kegiatan->user()->is($user);
    }

    public function viewTrashed(User $user): bool
    {
        return $this->viewAny($user);
    }
}
