import { Dosen } from "@/types/dosen";
import { Fakultas } from "./fakultas";

export interface Kegiatan {
    id: number;
    fakultas_id: number;
    fakultas: Fakultas
    dosen_id: number;
    dosen: Dosen;
    judul_kegiatan: string;
    abstrak: string;
    semester: string;
    tahun: number;
    link_berkas: string;
    sumber_dana: string;
    jumlah_dana: string;
    penulis: Text;
}
