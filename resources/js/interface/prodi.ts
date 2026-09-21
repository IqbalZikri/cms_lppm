import { Fakultas } from "./fakultas";

export interface Prodi {
    id: number;
    fakultas_id: number;
    fakultas: Fakultas;
    kode_prodi: number;
    nama_prodi: string;
}
