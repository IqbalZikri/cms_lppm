export interface Penulis {
    fakultas_id: number;
    dosen_id: number;
}

export interface Kegiatan {
    id: number;
    judul_kegiatan: string;
    abstrak: string;
    semester: string;
    tahun: number;
    link_berkas: string;
    sumber_dana: string;
    jumlah_dana: string;
    penulis: Penulis[];
}
