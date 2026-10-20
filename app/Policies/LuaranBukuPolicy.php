<?php

namespace App\Policies;

use App\Models\LuaranBuku;
use App\Models\User;

class LuaranBukuPolicy
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
    public function view(User $user, LuaranBuku $luaranBuku): bool
    {
        return LuaranBuku::withTrashed()
            ->visibleTo($user)
            ->whereKey($luaranBuku->id)
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
    public function update(User $user, LuaranBuku $luaranBuku): bool
    {
        return !$luaranBuku->trashed() && $luaranBuku->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, LuaranBuku $luaranBuku): bool
    {
        return $this->update($user, $luaranBuku);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, LuaranBuku $luaranBuku): bool
    {
        return $luaranBuku->trashed() && $luaranBuku->user_id === $user->id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, LuaranBuku $luaranBuku): bool
    {
        return $luaranBuku->trashed() && $luaranBuku->user()->is($user);
    }

    public function viewTrashed(User $user): bool
    {
        return $user->role === 'dosen';
    }
}
