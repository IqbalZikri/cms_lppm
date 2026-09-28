import { Dosen } from "@/types/dosen";
import { Fakultas } from "./fakultas";

export interface Penulis {
    id: number;
    penulisable_type: number;
    penulisable_id: number;
    fakultas_id: number;
    fakultas: Fakultas;
    dosen_id: number;
    dosen: Dosen;
    urutan: number;
}
