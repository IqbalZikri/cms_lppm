import { Penulis } from "./penulis";
import { PenulisLuar } from "./penulis-luar";

export interface Hki {
    id: number;
    jenis_hki: string;
    judul: string;
    abstrak: string;
    semester: string;
    tahun: number;
    link_berkas: string;
    nomer_pengajuan_haki?: number;
    nomer_paten?: string;
    jumlah_dana: number;
    sumber_dana: string;
    status_pengajuan: string;
    penulis: Penulis[];
    penulis_luar: PenulisLuar[];
    user_id: number;
}
