import type { LucideIcon } from "lucide-react";

export type Fakultas = { id: number; nama: string };
export type Semester = "ganjil" | "genap";
export type SumberDana = "internal" | "eksternal";
export type StatusPengajuan =
    "diajukan" | "direview" | "perlu_revisi" | "disetujui" | "ditolak";

/** Satu baris riwayat pengajuan/unggahan. Teks `keterangan` dirangkai di backend. */
export type RiwayatItem = {
    id: number;
    jenis?: string; // dipakai di dashboard: "Penelitian", "PKM", "HKI", "Jurnal"
    judul: string;
    keterangan: string; // contoh: "Tahun 2026, semester ganjil, dana internal Rp 15.000.000"
    tanggal: string; // sudah diformat, contoh: "21 September 2026"
    status: StatusPengajuan;
    catatan?: string | null; // catatan dari LPPM bila perlu diperbaiki / ditolak
    file_url?: string | null;
};

export type DosenInfo = { fakultas_id: number | null };

export type ChoiceOption<T extends string> = {
    value: T;
    label: string;
    description?: string;
    icon?: LucideIcon;
};

export type SharedProps = {
    auth?: { user?: { name?: string } };
    [key: string]: unknown;
};
