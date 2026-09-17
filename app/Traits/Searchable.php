<?php
// app/Traits/Searchable.php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Searchable
{
    /**
     * Scope untuk pencarian berdasarkan kolom yang didefinisikan di model.
     * Contoh pemakaian: Product::search('laptop')->get();
     */
    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (empty($term)) {
            return $query;
        }

        $searchableFields = $this->searchable ?? [];

        return $query->where(function (Builder $q) use ($term, $searchableFields) {
            foreach ($searchableFields as $field) {
                // Support relasi, misal: 'category.name'
                if (str_contains($field, '.')) {
                    [$relation, $column] = explode('.', $field, 2);
                    $q->orWhereHas($relation, function ($relQuery) use ($column, $term) {
                        $relQuery->where($column, 'like', "%{$term}%");
                    });
                } else {
                    $q->orWhere($field, 'like', "%{$term}%");
                }
            }
        });
    }
}