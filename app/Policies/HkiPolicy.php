<?php

namespace App\Policies;

use App\Models\Hki;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class HkiPolicy
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

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Hki $hki): bool
    {
        return Hki::withTrashed()
            ->visibleTo($user)
            ->whereKey($hki->id)
            ->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, self::ROLES, true);
    }

    public function updateStatus(User $user, Hki $hki): bool
    {
        return false; // admin lolos lewat before(). Ubah kalau UPPM boleh menyetujui.
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Hki $hki): bool
    {
        return !$hki->trashed() && $hki->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Hki $hki): bool
    {
        return $this->update($user, $hki);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Hki $hki): bool
    {
        return $hki->trashed() && $hki->user_id === $user->id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Hki $hki): bool
    {
        return $hki->trashed() && $hki->user()->is($user);
    }
}
