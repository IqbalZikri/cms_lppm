import { Dosen } from "@/types/dosen";
import { Fakultas } from "./fakultas";

export interface Penulis {
    id: number;
    penulisable_type: string;
    penulisable_id: number;
    nama_universitas: string;
    nama_dosen: string;
    urutan: number;
}
