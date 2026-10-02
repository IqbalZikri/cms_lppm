import { Penulis } from "./penulis";

export interface Kegiatan {
    id: number;
    judul: string;
    abstrak: string;
    semester: string;
    tahun: number;
    link_berkas: string;
    sumber_dana: string;
    jumlah_dana: string;
    penulis: Penulis[];
}
