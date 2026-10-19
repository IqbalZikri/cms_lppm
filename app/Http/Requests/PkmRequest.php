<?php

namespace App\Http\Requests;

use App\Models\Pkm;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PkmRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $pkm = $this->route("pkm");

        return $pkm
            ? $this->user()->can('update', $pkm)
            : $this->user()->can('create', Pkm::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'jenis_pkm' => ['required', Rule::in(['pelaksanaan', 'jurnal'])],
            'judul' => ['required', 'string', 'max:255'],
            'gambar' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:2048'],
            'abstrak' => ['required', 'string'],
            'semester' => ['required', Rule::in(['ganjil', 'genap'])], // sesuaikan nilainya
            'tahun' => ['required', 'digits:4'],
            'link_berkas' => ['required', 'url', 'max:2048'],
            'sumber_dana' => ['required', Rule::in(['internal', 'eksternal'])],
            'jumlah_dana' => ['required', 'numeric', 'min:0'],

            'authors' => ['required', 'array', 'min:1'],
            'authors.*.tipe' => ['required', Rule::in(['internal', 'luar'])],

            // internal
            'authors.*.fakultas_id' => ['required_if:authors.*.tipe,internal', 'nullable', 'exists:fakultas,id'],
            'authors.*.dosen_id' => ['required_if:authors.*.tipe,internal', 'nullable', 'exists:dosens,id', 'distinct'],

            // luar
            'authors.*.nama_universitas' => ['required_if:authors.*.tipe,luar', 'nullable', 'string', 'max:255'],
            'authors.*.nama_dosen' => ['required_if:authors.*.tipe,luar', 'nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'jenis_pkm.required' => 'Silahkan pilih jenis pkm',
            'judul.required' => 'Silahkan isi judul',
            'gambar.max' => 'Gambar tidak bisa lebih dari 2 MB',
            'gambar.mimes' => 'Format file harus berupa jpg / jpeg / png',
            'abstrak.required' => 'Silahkan isi abstrak',
            'semester.required' => 'Silahkan isi semester',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'sumber_dana.required' => 'Silahkan isi sumber dana',
            'sumber_dana.in' => 'Sumber dana tidak valid',
            'jumlah_dana.required' => 'Silahkan isi jumlah dana',
            'jumlah_dana.numeric' => 'Jumlah dana harus berupa angka',
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required_if' => 'Silahkan pilih fakultas',
            'authors.*.dosen_id.required_if' => 'Silahkan pilih dosen',
            'authors.*.nama_universitas.required_if' => 'Silahkan isi nama universitas',
            'authors.*.nama_dosen.required_if' => 'Silahkan isi nama dosen',
        ];
    }
}
