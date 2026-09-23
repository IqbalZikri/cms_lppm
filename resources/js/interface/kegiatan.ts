import { Dosen } from "@/types/dosen";
import { Fakultas } from "@/types/fakultas";

export interface Penulis {
    fakultas_id: number;
    nama_fakultas: string;
    dosen_id: number;
    nama_dosen: string;
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
