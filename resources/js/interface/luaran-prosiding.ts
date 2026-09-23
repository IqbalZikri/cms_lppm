export interface Penulis {
    fakultas_id: number;
    nama_fakultas: string;
    dosen_id: number;
    nama_dosen: string;
}

export interface LuaranProsiding {
    id: number;
    judul: string;
    abstrak: string;
    semester: string;
    tahun: number;
    link_berkas: string;
    penulis: Penulis[];
}
