<?php

namespace App\Http\Requests;

use App\Models\Kegiatan;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class KegiatanRequest extends FormRequest
{
    /**
     * Dijalankan sebelum validasi: 403 lebih dulu daripada 422.
     */
    public function authorize(): bool
    {
        $kegiatan = $this->route('kegiatan');

        return $kegiatan
            ? $this->user()->can('update', $kegiatan)       // route update
            : $this->user()->can('create', Kegiatan::class); // route store
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'judul'       => ['required', 'string'],
            'abstrak'     => ['required', 'string'],
            'semester'    => ['required'],
            'tahun'       => ['required', 'digits:4'],
            'link_berkas' => ['required', 'url'],
            'sumber_dana' => ['required'],
            'jumlah_dana' => ['required', 'numeric', 'min:0'],

            'authors'                    => ['required', 'array', 'min:1'],
            'authors.*.tipe'             => ['required', 'in:internal,luar'],
            'authors.*.fakultas_id'      => ['required_if:authors.*.tipe,internal', 'nullable', 'exists:fakultas,id'],
            'authors.*.dosen_id'         => ['required_if:authors.*.tipe,internal', 'nullable', 'exists:dosens,id'],
            'authors.*.nama_universitas' => ['required_if:authors.*.tipe,luar', 'nullable', 'string', 'max:255'],
            'authors.*.nama_dosen'       => ['required_if:authors.*.tipe,luar', 'nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'judul.required'       => 'Silahkan isi judul kegiatan',
            'abstrak.required'     => 'Silahkan isi abstrak',
            'semester.required'    => 'Silahkan isi semester',
            'tahun.required'       => 'Silahkan isi tahun',
            'tahun.digits'         => 'Tahun harus terdiri dari 4 digit',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'link_berkas.url'      => 'Link berkas harus berupa URL yang valid',
            'sumber_dana.required' => 'Silahkan isi sumber dana',
            'jumlah_dana.required' => 'Silahkan isi jumlah dana',
            'jumlah_dana.numeric'  => 'Jumlah dana harus berupa angka',
            'jumlah_dana.min'      => 'Jumlah dana tidak boleh negatif',

            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.min'      => 'Silahkan tambahkan minimal satu penulis',

            'authors.*.fakultas_id.required_if'      => 'Silahkan pilih fakultas',
            'authors.*.dosen_id.required_if'         => 'Silahkan pilih dosen',
            'authors.*.nama_universitas.required_if' => 'Silahkan isi nama universitas',
            'authors.*.nama_dosen.required_if'       => 'Silahkan isi nama dosen',
        ];
    }
}