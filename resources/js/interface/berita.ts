import { Kategori } from "./kategori";
import { User } from "./user";

export interface Berita {
    id: number;
    kategori_id: number;
    kategori: keyof Kategori;
    judul_berita: string;
    isi_berita: string;
    views?: number;
    gambar?: string;
    status_published: string;
    slug: string;
    published_at?: Date;
    deleted_at?: Date;
    user_id: keyof User;
}
