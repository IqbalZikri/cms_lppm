import { Fakultas } from "./fakultas";

export interface Prodi {
    id: number;
    fakultas_id: keyof Fakultas;
    kode_prodi: number;
    nama_prodi: string;
}
