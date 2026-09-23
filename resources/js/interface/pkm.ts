export interface Pelaksana {
    fakultas_id: number;
    nama_fakultas: string;
    dosen_id: number;
    nama_dosen: string;
}

export interface Pkm {
    id: number;
    jenis_pkm: string;
    judul: string;
    abstrak: string;
    semester: string;
    tahun: number;
    link_berkas: string;
    sumber_dana: string;
    jumlah_dana: string;
    penulis: Pelaksana[];
}
