import { ArrowLeft, Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Head, Link } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Dosen } from "@/types/dosen";
import { route } from "ziggy-js";

interface Props {
    dosen: Dosen;
}

/* -------------------------------------------------------------------------- */
/*  Konfigurasi sumber data                                                   */
/* -------------------------------------------------------------------------- */

const SOURCES = [
    {
        key: "scopus",
        label: "Scopus",
        stroke: "stroke-amber-500",
        bg: "bg-amber-500",
        text: "text-amber-600 dark:text-amber-400",
        hasIndex: true,
    },
    {
        key: "gs",
        label: "Google Scholar",
        stroke: "stroke-blue-500",
        bg: "bg-blue-500",
        text: "text-blue-600 dark:text-blue-400",
        hasIndex: true,
    },
    {
        key: "wos",
        label: "Web of Science",
        stroke: "stroke-violet-500",
        bg: "bg-violet-500",
        text: "text-violet-600 dark:text-violet-400",
        hasIndex: true,
    },
    {
        key: "garuda",
        label: "Garuda",
        stroke: "stroke-emerald-500",
        bg: "bg-emerald-500",
        text: "text-emerald-600 dark:text-emerald-400",
        hasIndex: false,
    },
] as const;

type Source = (typeof SOURCES)[number];

const INDEXES = [
    { key: "h-index", label: "h-index" },
    { key: "g-index", label: "g-index" },
    { key: "i10-index", label: "i10-index" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Helper                                                                    */
/* -------------------------------------------------------------------------- */

type ScoreRecord = Record<string, unknown>;

const getNum = (score: ScoreRecord, field: string): number => {
    const n = Number(score[field] ?? 0);
    return Number.isFinite(n) ? n : 0;
};

const fmt = (n: number, digits = 0) =>
    new Intl.NumberFormat("id-ID", {
        maximumFractionDigits: digits,
    }).format(n);

const percent = (part: number, total: number) =>
    total > 0 ? (part / total) * 100 : 0;

const isActive = (v: unknown) =>
    v === true || v === 1 || v === "1" || v === "aktif" || v === "Aktif";

/* -------------------------------------------------------------------------- */
/*  Donut chart (SVG, nilai selalu tampil di tengah, tanpa tooltip)           */
/* -------------------------------------------------------------------------- */

interface Segment {
    value: number;
    className: string;
}

interface DonutProps {
    segments: Segment[];
    total?: number;
    size?: number;
    strokeWidth?: number;
    children?: ReactNode;
}

function Donut({
    segments,
    total,
    size = 160,
    strokeWidth = 10,
    children,
}: DonutProps) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const r = 40;
    const C = 2 * Math.PI * r;
    const sum = total ?? segments.reduce((acc, s) => acc + s.value, 0);

    let offset = 0;

    return (
        <div
            className="relative shrink-0"
            style={{ width: size, height: size }}
        >
            <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                <circle
                    cx="50"
                    cy="50"
                    r={r}
                    fill="none"
                    strokeWidth={strokeWidth}
                    className="stroke-muted"
                />

                {segments.map((s, i) => {
                    const len = sum > 0 ? (s.value / sum) * C : 0;
                    const gap = segments.length > 1 && len > 2 ? 1.2 : 0;
                    const dash = Math.max(len - gap, 0);

                    const el = (
                        <circle
                            key={i}
                            cx="50"
                            cy="50"
                            r={r}
                            fill="none"
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${ready ? dash : 0} ${C}`}
                            strokeDashoffset={-offset}
                            className={cn(
                                s.className,
                                "transition-[stroke-dasharray] duration-1000 ease-out motion-reduce:transition-none",
                            )}
                        />
                    );

                    offset += len;
                    return el;
                })}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {children}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Komponen kecil                                                            */
/* -------------------------------------------------------------------------- */

function LegendRow({
    dotClass,
    label,
    value,
    hint,
}: {
    dotClass: string;
    label: string;
    value: string;
    hint?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-3 text-sm">
            <div className="flex min-w-0 items-center gap-2">
                <span
                    className={cn("size-2.5 shrink-0 rounded-full", dotClass)}
                />
                <span className="text-muted-foreground truncate">{label}</span>
            </div>

            <div className="flex items-baseline gap-1.5 tabular-nums">
                <span className="font-semibold">{value}</span>
                {hint && (
                    <span className="text-muted-foreground text-xs">
                        {hint}
                    </span>
                )}
            </div>
        </div>
    );
}

function MiniRing({
    label,
    value,
    max,
    strokeClass,
}: {
    label: string;
    value: number;
    max: number;
    strokeClass: string;
}) {
    return (
        <div className="flex flex-col items-center gap-1.5">
            <Donut
                size={76}
                strokeWidth={11}
                total={Math.max(max, 1)}
                segments={[{ value, className: strokeClass }]}
            >
                <span className="text-base leading-none font-semibold tabular-nums">
                    {fmt(value)}
                </span>
            </Donut>

            <span className="text-muted-foreground text-xs">{label}</span>
        </div>
    );
}

function StatTile({ label, value }: { label: string; value: number }) {
    return (
        <div className="bg-muted/50 rounded-lg px-3 py-2">
            <p className="text-muted-foreground text-xs">{label}</p>
            <p className="text-lg font-semibold tabular-nums">{fmt(value)}</p>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Section skor penelitian                                                   */
/* -------------------------------------------------------------------------- */

function ScoreSection({ dosen }: { dosen: Dosen }) {
    const raw = dosen.score_penelitian;

    if (!raw) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Skor Penelitian</CardTitle>
                </CardHeader>

                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Data skor penelitian dosen ini belum tersedia.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const score = raw as unknown as ScoreRecord;

    const sintaOverall = getNum(score, "sinta_score_overall_versi_3");
    const sinta3yr = getNum(score, "sinta_score_3yr");

    const rows = SOURCES.map((src) => ({
        src,
        dokumen: getNum(score, `dokumen_${src.key}`),
        sitasi: getNum(score, `sitasi_${src.key}`),
        tersitasi: getNum(score, `dokumen_tersitasi_${src.key}`),
        indexes: INDEXES.map((idx) => ({
            ...idx,
            value: src.hasIndex ? getNum(score, `${idx.key}_${src.key}`) : 0,
        })),
    }));

    const totalDokumen = rows.reduce((a, r) => a + r.dokumen, 0);
    const totalSitasi = rows.reduce((a, r) => a + r.sitasi, 0);

    // Nilai maksimum tiap indeks antar sumber, supaya ring bisa dibandingkan
    const maxIndex = INDEXES.reduce<Record<string, number>>((acc, idx) => {
        acc[idx.key] = Math.max(
            ...rows.map(
                (r) => r.indexes.find((i) => i.key === idx.key)?.value ?? 0,
            ),
            1,
        );
        return acc;
    }, {});

    const share3yr = percent(sinta3yr, sintaOverall);

    return (
        <section className="space-y-4">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Skor Penelitian
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Ringkasan capaian publikasi dan sitasi dari SINTA,
                        Scopus, Google Scholar, Web of Science, dan Garuda.
                    </p>
                </div>

                <Badge
                    variant={
                        isActive(score.status_aktif) ? "default" : "secondary"
                    }
                    className="w-fit"
                >
                    {isActive(score.status_aktif) ? "Aktif" : "Tidak aktif"}
                </Badge>
            </div>

            {/* Ringkasan */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* SINTA */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Skor SINTA</CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center gap-5">
                        <Donut
                            size={170}
                            strokeWidth={9}
                            total={Math.max(sintaOverall, sinta3yr)}
                            segments={[
                                {
                                    value: sinta3yr,
                                    className: "stroke-primary",
                                },
                                {
                                    value: Math.max(sintaOverall - sinta3yr, 0),
                                    className: "stroke-primary/25",
                                },
                            ]}
                        >
                            <span className="text-3xl font-bold tabular-nums">
                                {fmt(sintaOverall)}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                Overall v3
                            </span>
                        </Donut>

                        <div className="w-full space-y-2">
                            <LegendRow
                                dotClass="bg-primary/25"
                                label="Overall versi 3"
                                value={fmt(sintaOverall)}
                            />
                            <LegendRow
                                dotClass="bg-primary"
                                label="3 tahun terakhir"
                                value={fmt(sinta3yr)}
                                hint={`${fmt(share3yr, 1)}%`}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Sebaran dokumen */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Sebaran Dokumen
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center gap-5">
                        <Donut
                            size={170}
                            strokeWidth={9}
                            segments={rows.map((r) => ({
                                value: r.dokumen,
                                className: r.src.stroke,
                            }))}
                        >
                            <span className="text-3xl font-bold tabular-nums">
                                {fmt(totalDokumen)}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                Total dokumen
                            </span>
                        </Donut>

                        <div className="w-full space-y-2">
                            {rows.map((r) => (
                                <LegendRow
                                    key={r.src.key}
                                    dotClass={r.src.bg}
                                    label={r.src.label}
                                    value={fmt(r.dokumen)}
                                    hint={`${fmt(percent(r.dokumen, totalDokumen), 1)}%`}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Sebaran sitasi */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Sebaran Sitasi
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center gap-5">
                        <Donut
                            size={170}
                            strokeWidth={9}
                            segments={rows.map((r) => ({
                                value: r.sitasi,
                                className: r.src.stroke,
                            }))}
                        >
                            <span className="text-3xl font-bold tabular-nums">
                                {fmt(totalSitasi)}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                Total sitasi
                            </span>
                        </Donut>

                        <div className="w-full space-y-2">
                            {rows.map((r) => (
                                <LegendRow
                                    key={r.src.key}
                                    dotClass={r.src.bg}
                                    label={r.src.label}
                                    value={fmt(r.sitasi)}
                                    hint={`${fmt(percent(r.sitasi, totalSitasi), 1)}%`}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detail per sumber */}
            <div className="grid gap-4 lg:grid-cols-2">
                {rows.map((r) => (
                    <SourceCard
                        key={r.src.key}
                        src={r.src}
                        dokumen={r.dokumen}
                        sitasi={r.sitasi}
                        tersitasi={r.tersitasi}
                        indexes={r.indexes}
                        maxIndex={maxIndex}
                    />
                ))}
            </div>
        </section>
    );
}

function SourceCard({
    src,
    dokumen,
    sitasi,
    tersitasi,
    indexes,
    maxIndex,
}: {
    src: Source;
    dokumen: number;
    sitasi: number;
    tersitasi: number;
    indexes: { key: string; label: string; value: number }[];
    maxIndex: Record<string, number>;
}) {
    const citedRate = percent(tersitasi, dokumen);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <span className={cn("size-3 rounded-full", src.bg)} />
                    {src.label}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
                <div className="flex flex-col items-center gap-5 sm:flex-row">
                    <Donut
                        size={140}
                        strokeWidth={10}
                        total={dokumen}
                        segments={[{ value: tersitasi, className: src.stroke }]}
                    >
                        <span
                            className={cn(
                                "text-2xl font-bold tabular-nums",
                                src.text,
                            )}
                        >
                            {fmt(citedRate, 1)}%
                        </span>
                        <span className="text-muted-foreground text-xs">
                            tersitasi
                        </span>
                    </Donut>

                    <div className="grid w-full flex-1 grid-cols-3 gap-2 sm:grid-cols-1">
                        <StatTile label="Dokumen" value={dokumen} />
                        <StatTile label="Dokumen tersitasi" value={tersitasi} />
                        <StatTile label="Sitasi" value={sitasi} />
                    </div>
                </div>

                {src.hasIndex && (
                    <>
                        <Separator />

                        <div className="grid grid-cols-3 gap-2">
                            {indexes.map((idx) => (
                                <MiniRing
                                    key={idx.key}
                                    label={idx.label}
                                    value={idx.value}
                                    max={maxIndex[idx.key]}
                                    strokeClass={src.stroke}
                                />
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

/* -------------------------------------------------------------------------- */
/*  Halaman                                                                   */
/* -------------------------------------------------------------------------- */

export default function Show({ dosen }: Props) {
    return (
        <>
            <Head title={`Dosen - ${dosen.nama_dosen}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Detail Dosen
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Informasi lengkap mengenai dosen.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link
                                href={route("uppm.dosen.index")}
                                viewTransition
                            >
                                <ArrowLeft />
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Profile */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-6 md:flex-row">
                            {/* Foto */}
                            <div className="flex justify-center md:justify-start">
                                <div className="bg-muted h-40 w-40 overflow-hidden rounded-xl border">
                                    {dosen.foto ? (
                                        <img
                                            src={dosen.foto}
                                            alt={`Foto ${dosen.nama_dosen}`}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                                            <User className="size-16" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Identitas utama */}
                            <div className="flex-1 space-y-3 text-center md:text-left">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {dosen.nama_dosen}
                                    </h2>

                                    <p className="text-muted-foreground">
                                        {dosen.nidn
                                            ? `NIDN: ${dosen.nidn}`
                                            : "NIDN belum tersedia"}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2 text-sm md:flex-row md:flex-wrap">
                                    <div>
                                        <span className="font-medium">
                                            Fakultas:
                                        </span>{" "}
                                        {dosen.fakultas?.nama_fakultas ?? "-"}
                                    </div>

                                    <div>
                                        <span className="font-medium">
                                            Program Studi:
                                        </span>{" "}
                                        {dosen.prodi?.nama_prodi ?? "-"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Skor Penelitian */}
                <ScoreSection dosen={dosen} />

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Data Kepegawaian */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Kepegawaian</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <InfoRow label="NIDN" value={String(dosen.nidn)} />

                            <Separator />

                            <InfoRow
                                label="NUPTK"
                                value={String(dosen.nuptk)}
                            />

                            <Separator />

                            <InfoRow
                                label="Fakultas"
                                value={dosen.fakultas?.nama_fakultas}
                            />

                            <Separator />

                            <InfoRow
                                label="Kode Fakultas"
                                value={dosen.fakultas?.kode_fakultas}
                            />

                            <Separator />

                            <InfoRow
                                label="Program Studi"
                                value={dosen.prodi?.nama_prodi}
                            />

                            <Separator />

                            <InfoRow
                                label="Kode Program Studi"
                                value={String(dosen.prodi?.kode_prodi)}
                            />
                        </CardContent>
                    </Card>

                    {/* Data Pribadi */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Pribadi</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <InfoRow
                                label="Nama Lengkap"
                                value={dosen.nama_dosen}
                            />

                            <Separator />

                            <InfoRow
                                label="Jenis Kelamin"
                                value={dosen.jenis_kelamin}
                            />

                            <Separator />

                            <InfoRow
                                label="Tempat Lahir"
                                value={dosen.tempat_lahir}
                            />

                            <Separator />

                            <InfoRow
                                label="Tanggal Lahir"
                                value={formatTanggal(dosen.tanggal_lahir)}
                            />

                            <Separator />

                            <div className="flex gap-3">
                                <MapPin className="text-muted-foreground mt-0.5 size-5 shrink-0" />

                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Alamat
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {dosen.alamat ?? "-"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kontak */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kontak</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="flex gap-3">
                                <Phone className="text-muted-foreground mt-0.5 size-5" />

                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Nomor HP
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {dosen.hp ?? "-"}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex gap-3">
                                <Mail className="text-muted-foreground mt-0.5 size-5" />

                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Email
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {dosen.email ?? "-"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Akun */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Akun Pengguna</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <InfoRow
                                label="Nama User"
                                value={dosen.user?.name}
                            />

                            <Separator />

                            <InfoRow
                                label="Email User"
                                value={dosen.user?.email}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

interface InfoRowProps {
    label: string;
    value?: string | null;
}

function InfoRow({ label, value }: InfoRowProps) {
    return (
        <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">{label}</p>

            <p className="text-sm font-medium">{value ?? "-"}</p>
        </div>
    );
}

function formatTanggal(tanggal?: string | null) {
    if (!tanggal) {
        return "-";
    }

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(tanggal));
}

Show.layout = {
    breadcrumbs: [
        {
            title: "Detail Dosen",
        },
    ],
};
