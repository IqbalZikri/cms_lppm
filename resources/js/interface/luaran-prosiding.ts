import { Penulis } from "./penulis";


export interface LuaranProsiding {
    id: number;
    judul: string;
    abstrak: string;
    semester: string;
    tahun: number;
    link_berkas: string;
    penulis: Penulis[];
}
