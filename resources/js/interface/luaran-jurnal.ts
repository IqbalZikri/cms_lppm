import { Penulis } from "./penulis";

export interface LuaranJurnal {
    id: number;
    jenis_luaran_jurnal: string;
    judul: string;
    abstrak: string;
    semester: string;
    tahun: number;
    link_berkas: string;
    penulis: Penulis[];
}
