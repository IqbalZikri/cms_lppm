export interface SiteData {
    nama: string | null;
    logo: string | null;
    alamat: string | null;
    email: string | null;
    telepon: string | null;
    whatsapp: string | null;
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
}

export interface SharedData {
    // ...props yang sudah ada
    site: SiteData;
    [key: string]: unknown;
}
