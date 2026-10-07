import { Penulis } from "./penulis";
import { PenulisLuar } from "./penulis-luar";


export interface LuaranProsiding {
    id: number;
    judul: string;
    abstrak: string;
    semester: string;
    tahun: number;
    link_berkas: string;
    penulis: Penulis[];
    penulis_luar: PenulisLuar[];
}
