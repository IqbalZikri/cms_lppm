export interface Pelaksana {
    fakultas_id: number;
    dosen_id: number;
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
    pelaksana: Pelaksana[];
}
