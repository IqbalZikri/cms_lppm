import { Penulis } from "./penulis";
import { PenulisLuar } from "./penulis-luar";

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
    penulis_luar: PenulisLuar[];
}
