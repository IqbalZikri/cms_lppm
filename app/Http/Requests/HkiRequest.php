<?php

namespace App\Http\Requests;

use App\Enums\StatusPengajuan;
use App\Models\Hki;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;

class HkiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $hki = $this->route('hki');

        return $hki ? $this->user()->can('update', $hki) : $this->user()->can('create', Hki::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */

    public function isDraft(): bool
    {
        return $this->input('action') === 'draft';
    }

    public function rules(): array
    {
        return $this->isDraft() ? $this->draftRules() : $this->submitRules();
    }

    public function submitRules(): array
    {
        return [
            'judul' => ['required', 'string', 'max:255'],
            'jenis_hki' => ['required', 'in:paten,haki'],
            'abstrak' => ['required', 'string'],
            'semester' => ['required', 'in:Ganjil,Genap'],
            'tahun' => ['required', 'integer'],
            'link_berkas' => ['required', 'url'],
            'nomer_paten' => ['required_if:jenis_hki,paten', 'nullable', 'string'],
            'nomer_pengajuan_haki' => ['required_if:jenis_hki,haki', 'nullable', 'string'],
            'jumlah_dana' => ['required'],
            'sumber_dana' => ['required', 'in:internal,eksternal'],
            'authors' => ['required', 'array', 'min:1'],
            'authors.*.tipe' => ['required', 'in:internal,luar'],
            'authors.*.fakultas_id' => ['required_if:authors.*.tipe,internal', 'nullable', 'exists:fakultas,id'],
            'authors.*.dosen_id' => ['required_if:authors.*.tipe,internal', 'nullable', 'exists:dosens,id'],
            'authors.*.nama_universitas' => ['required_if:authors.*.tipe,luar', 'nullable', 'string', 'max:255'],
            'authors.*.nama_dosen' => ['required_if:authors.*.tipe,luar', 'nullable', 'string', 'max:255'],
        ];
    }

    public function draftRules(): array
    {
        return [
            'judul' => ['required', 'string', 'max:255'], // agar draft bisa dikenali di daftar
            'jenis_hki' => ['nullable', 'string'],
            'abstrak' => ['nullable', 'string'],
            'semester' => ['nullable', 'in:Ganjil,Genap'],
            'tahun' => ['nullable', 'integer'],
            'nomer_pengajuan_haki' => ['nullable', 'integer'],
            'nomer_paten' => ['nullable', 'integer'],
            'jumlah_dana' => ['nullable'],
            'sumber_dana' => ['nullable', 'in:internal,eksternal'],
            'link_berkas' => ['nullable', 'url'],
            'authors' => ['nullable', 'array'],
        ];
    }

    public function attributes(): array
    {
        return [
            'link_berkas' => 'link berkas',
            'jenis_hki' => 'jenis HKI',
        ];
    }

    public function messages(): array
    {
        return [
            'judul.required' => 'Judul wajib diisi.',
            'judul.max' => 'Judul maksimal :max karakter.',
            'jenis_hki.required' => 'Pilih jenis HKI terlebih dahulu.',
            'abstrak.required' => 'Abstrak wajib diisi.',
            'semester.in' => 'Semester harus Ganjil atau Genap.',
            'tahun.integer' => 'Tahun harus berupa angka.',
            'link_berkas.required' => 'Link berkas wajib diisi.',
            'link_berkas.url' => 'Format link berkas tidak valid.',
            'authors.required' => 'Minimal harus ada satu penulis.',
            'authors.min' => 'Minimal harus ada :min penulis.',
            'nomer_paten.required_if' => 'Nomor paten wajib diisi jika jenis HKI berupa paten.',
            'nomer_pengajuan_haki.required_if' => 'Nomor pengajuan HAKI wajib diisi jika jenis HKI berupa HAKI.',
        ];
    }

    public function statusPengajuan(): StatusPengajuan
    {
        if ($this->isDraft()) {
            return StatusPengajuan::Draft;
        }

        return $this->user()->role === 'admin'
            ? StatusPengajuan::Disetujui
            : StatusPengajuan::Diajukan;
    }

    /** Data siap simpan, tanpa authors. */
    public function hkiData(): array
    {
        return [
            ...Arr::except($this->validated(), ['authors']),
            'status_pengajuan' => $this->statusPengajuan(),
        ];
    }

    public function authors(): array
    {
        return $this->validated('authors', []);
    }
}
