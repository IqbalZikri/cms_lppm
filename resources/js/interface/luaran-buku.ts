import { Penulis } from "./penulis";


export interface LuaranBuku {
    id: number;
    judul: string;
    isbn: number;
    tahun: number;
    link_berkas: string;
    penulis: Penulis[];
}
