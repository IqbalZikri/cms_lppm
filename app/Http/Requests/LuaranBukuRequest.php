<?php

namespace App\Http\Requests;

use App\Models\LuaranBuku;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LuaranBukuRequest extends FormRequest
{
    /**
     * Dijalankan sebelum validasi: 403 lebih dulu daripada 422.
     */
    public function authorize(): bool
    {
        $luaranJurnal = $this->route('luaran_buku');

        return $luaranJurnal
            ? $this->user()->can('update', $luaranJurnal)       // route update
            : $this->user()->can('create', LuaranBuku::class); // route store
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'judul' => ['required', 'string'],
            'isbn' => ['required'],
            'tahun' => ['required', 'digits:4'],
            'link_berkas' => ['required', 'url'],

            'authors' => ['required', 'array', 'min:1'],
            'authors.*.tipe' => ['required', 'in:internal,luar'],
            'authors.*.fakultas_id' => ['required_if:authors.*.tipe,internal', 'nullable', 'exists:fakultas,id'],
            'authors.*.dosen_id' => ['required_if:authors.*.tipe,internal', 'nullable', 'exists:dosens,id'],
            'authors.*.nama_universitas' => ['required_if:authors.*.tipe,luar', 'nullable', 'string', 'max:255'],
            'authors.*.nama_dosen' => ['required_if:authors.*.tipe,luar', 'nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'judul.required' => 'Silahkan isi judul luaranJurnal',
            'isbn.required' => 'Silahkan isi ISBN',
            'tahun.required' => 'Silahkan isi tahun',
            'tahun.digits' => 'Tahun harus terdiri dari 4 digit',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'link_berkas.url' => 'Link berkas harus berupa URL yang valid',

            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.min' => 'Silahkan tambahkan minimal satu penulis',

            'authors.*.fakultas_id.required_if' => 'Silahkan pilih fakultas',
            'authors.*.dosen_id.required_if' => 'Silahkan pilih dosen',
            'authors.*.nama_universitas.required_if' => 'Silahkan isi nama universitas',
            'authors.*.nama_dosen.required_if' => 'Silahkan isi nama dosen',
        ];
    }
}
