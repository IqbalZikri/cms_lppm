<?php

namespace App\Policies;

use App\Models\Pkm;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PkmPolicy
{
    private const ROLES = ["admin", "dosen", "uppm"];

    public function before(User $user): ?bool
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

    public function viewTrashed(User $user)
    {
        return $user->role === 'dosen';
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Pkm $pkm): bool
    {
        return Pkm::withTrashed()->visibleTo($user)->whereKey($pkm->id)->exists();
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
    public function update(User $user, Pkm $pkm): bool
    {
        return !$pkm->trashed() && $pkm->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Pkm $pkm): bool
    {
        return $this->update($user, $pkm);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Pkm $pkm): bool
    {
        return $pkm->trashed() && $pkm->user_id === $user->id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Pkm $pkm): bool
    {
        return $pkm->trashed() && $pkm->user()->is($user);
    }
}
