import {
    AlertCircle,
    Award,
    BookOpen,
    CheckCircle2,
    Clock,
    Eye,
    FlaskConical,
    HeartHandshake,
    XCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ChoiceOption, Semester, StatusPengajuan, SumberDana } from '@/types/lppm';

/* ------------------------------------------------------------------ */
/* Alamat halaman. Ganti bila route Laravel Anda berbeda.              */
/* ------------------------------------------------------------------ */
export const ROUTES = {
    dashboard: '/dosen',
    penelitian: '/dosen/penelitian',
    pkm: '/dosen/pkm',
    hki: '/dosen/hki',
    jurnal: '/dosen/jurnal',
    logout: '/logout',
} as const;

/** Batas ukuran file (MB). Samakan dengan aturan `max:10240` di backend. */
export const MAX_UPLOAD_MB = 10;

/* ------------------------------------------------------------------ */
/* Gaya tombol (tinggi 56px, teks 18px, cincin fokus oranye tegas)     */
/* ------------------------------------------------------------------ */
const BTN_BASE =
    'inline-flex h-14 items-center justify-center gap-3 rounded-xl px-7 text-lg font-bold transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-uca-orange-600 focus-visible:ring-offset-2 ' +
    'disabled:cursor-not-allowed disabled:opacity-60';

export const BTN_PRIMARY = `${BTN_BASE} bg-uca-green-800 text-white hover:bg-uca-green-900`;
export const BTN_SECONDARY = `${BTN_BASE} border-2 border-uca-green-800 bg-white text-uca-green-800 hover:bg-uca-green-50`;
export const BTN_DANGER = `${BTN_BASE} border-2 border-red-700 bg-white text-red-800 hover:bg-red-50`;

/* ------------------------------------------------------------------ */
/* Menu portal dosen                                                   */
/* ------------------------------------------------------------------ */
export type PortalMenuItem = {
    key: 'penelitian' | 'pkm' | 'hki' | 'jurnal';
    href: string;
    label: string;
    title: string;
    description: string;
    unit: string;
    icon: LucideIcon;
};

export const PORTAL_MENU: PortalMenuItem[] = [
    {
        key: 'penelitian',
        href: ROUTES.penelitian,
        label: 'Penelitian',
        title: 'Penelitian',
        description: 'Ajukan penelitian beserta dana dan abstraknya.',
        unit: 'pengajuan',
        icon: FlaskConical,
    },
    {
        key: 'pkm',
        href: ROUTES.pkm,
        label: 'Pengabdian (PKM)',
        title: 'Pengabdian kepada Masyarakat',
        description: 'Ajukan kegiatan pelaksanaan PKM atau artikel jurnal PKM.',
        unit: 'pengajuan',
        icon: HeartHandshake,
    },
    {
        key: 'hki',
        href: ROUTES.hki,
        label: 'HKI',
        title: 'Hak Kekayaan Intelektual',
        description: 'Unggah sertifikat hak cipta, paten, merek, dan HKI lainnya.',
        unit: 'berkas',
        icon: Award,
    },
    {
        key: 'jurnal',
        href: ROUTES.jurnal,
        label: 'Jurnal',
        title: 'Jurnal Ilmiah',
        description: 'Unggah artikel jurnal Scopus, SINTA, atau jurnal lainnya.',
        unit: 'artikel',
        icon: BookOpen,
    },
];

/* ------------------------------------------------------------------ */
/* Pilihan isian                                                       */
/* ------------------------------------------------------------------ */
export const SEMESTER_OPTIONS: ChoiceOption<Semester>[] = [
    { value: 'ganjil', label: 'Ganjil', description: 'Semester ganjil' },
    { value: 'genap', label: 'Genap', description: 'Semester genap' },
];

export const SUMBER_DANA_OPTIONS: ChoiceOption<SumberDana>[] = [
    { value: 'internal', label: 'Internal', description: 'Dana dari Universitas Cendekia Abditama' },
    { value: 'eksternal', label: 'Eksternal', description: 'Dana dari pihak di luar kampus' },
];

export function tahunOptions(back = 5, forward = 1): { value: string; label: string }[] {
    const now = new Date().getFullYear();
    return Array.from({ length: back + forward + 1 }, (_, i) => {
        const year = String(now + forward - i);
        return { value: year, label: year };
    });
}

export const tahunSekarang = () => String(new Date().getFullYear());

/* ------------------------------------------------------------------ */
/* Status                                                              */
/* ------------------------------------------------------------------ */
export const STATUS_META: Record<StatusPengajuan, { label: string; icon: LucideIcon; className: string }> = {
    diajukan: {
        label: 'Menunggu diperiksa',
        icon: Clock,
        className: 'border-slate-600 bg-slate-100 text-slate-900',
    },
    direview: {
        label: 'Sedang ditinjau',
        icon: Eye,
        className: 'border-uca-gold-700 bg-uca-gold-100 text-uca-gold-800',
    },
    perlu_revisi: {
        label: 'Perlu diperbaiki',
        icon: AlertCircle,
        className: 'border-uca-orange-600 bg-uca-orange-100 text-uca-orange-800',
    },
    disetujui: {
        label: 'Disetujui',
        icon: CheckCircle2,
        className: 'border-uca-green-700 bg-uca-green-100 text-uca-green-900',
    },
    ditolak: {
        label: 'Ditolak',
        icon: XCircle,
        className: 'border-red-700 bg-red-50 text-red-900',
    },
};

/* ------------------------------------------------------------------ */
/* Pembantu                                                            */
/* ------------------------------------------------------------------ */
export function countWords(text: string): number {
    const trimmed = text.trim();
    return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
}

export function formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
}

/** Cek isian wajib di browser supaya pesan langsung muncul, tanpa menunggu server. */
export function validateRequired<T extends Record<string, unknown>>(
    data: T,
    rules: Partial<Record<keyof T, string>>,
): Partial<Record<keyof T, string>> {
    const errors: Partial<Record<keyof T, string>> = {};
    (Object.keys(rules) as (keyof T)[]).forEach((key) => {
        const value = data[key];
        const empty = value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
        if (empty) errors[key] = rules[key];
    });
    return errors;
}

/** Pindahkan kursor ke isian pertama yang salah, agar tidak perlu mencari-cari. */
export function focusFirstError(errors: object): void {
    const first = Object.keys(errors)[0];
    if (first) window.setTimeout(() => document.getElementById(first)?.focus(), 0);
}

export function confirmReset(action: () => void): void {
    if (window.confirm('Semua isian akan dikosongkan. Lanjutkan?')) action();
}