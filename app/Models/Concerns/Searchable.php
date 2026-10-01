<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;

trait Searchable
{
    /**
     * Pemakaian: Dosen::search('budi')->paginate(10);
     */
    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        $term = trim((string) $term);

        if ($term === '') {
            return $query;
        }

        // escape karakter khusus LIKE agar "%" atau "_" yang diketik user dianggap teks biasa
        $escaped = addcslashes($term, '%_\\');
        $like = "%{$escaped}%";

        $fields = property_exists($this, 'searchable') ? $this->searchable : [];

        return $query->where(function (Builder $q) use ($fields, $like) {
            foreach ($fields as $field) {
                if (str_contains($field, '.')) {
                    // relasi: 'fakultas.nama_fakultas'
                    $column = substr(strrchr($field, '.'), 1);
                    $relation = substr($field, 0, -(strlen($column) + 1));

                    $q->orWhereHas($relation, fn(Builder $r) => $r->where($column, 'ilike', $like));
                } else {
                    $q->orWhere($field, 'ilike', $like);
                }
            }
        });
    }
}