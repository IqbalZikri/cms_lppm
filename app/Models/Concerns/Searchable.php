<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

trait Searchable
{
    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        $term = trim((string) $term);
        $fields = $this->searchable ?? [];

        if ($term === '' || empty($fields)) {
            return $query;
        }

        $like = '%' . addcslashes($term, '%_\\') . '%';

        return $query->where(function (Builder $q) use ($fields, $like) {
            foreach ($fields as $field) {
                if (str_contains($field, '.')) {
                    $relation = Str::beforeLast($field, '.');
                    $column = Str::afterLast($field, '.');

                    $q->orWhereHas($relation, fn(Builder $r) => $r->where($column, 'ilike', $like));
                } else {
                    $q->orWhere($this->qualifyColumn($field), 'ilike', $like);
                }
            }
        });
    }
}