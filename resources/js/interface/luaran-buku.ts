import { Penulis } from "./penulis";
import { PenulisLuar } from "./penulis-luar";


export interface LuaranBuku {
    id: number;
    judul: string;
    isbn: number;
    tahun: number;
    link_berkas: string;
    penulis: Penulis[];
    penulis_luar: PenulisLuar[];
}
