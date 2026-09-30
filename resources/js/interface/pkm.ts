import { Penulis } from "./penulis";

export interface Pkm {
    id: number;
    jenis_pkm: string;
    judul: string;
    slug: string;
    abstrak: string;
    semester: string;
    tahun: number;
    link_berkas: string;
    sumber_dana: string;
    jumlah_dana: string;
    penulis: Penulis[];
}
