import { Fakultas } from "@/interface/fakultas";
import { Prodi } from "@/interface/prodi";
import { User } from "@/interface/user";

export type Dosen = {
    id: number;
    fakultas_id: number;
    fakultas?: Fakultas;
    prodi_id: number;
    prodi?: Prodi;
    nidn: number;
    nuptk: number;
    nama_dosen: string;
    jenis_kelamin: string;
    tanggal_lahir: string ;
    tempat_lahir: string;
    alamat: string;
    hp: number;
    email: string;
    foto: string;
    user_id: number;
    user: User;
};
