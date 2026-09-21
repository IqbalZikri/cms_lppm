import { FileText, Inbox, MessageSquareWarning } from "lucide-react";
import { STATUS_META } from "@/lib/lppm";
import { cn } from "@/lib/utils";
import type { RiwayatItem, StatusPengajuan } from "@/types/lppm";

/* Status selalu berupa ikon + teks, tidak hanya warna. */
export function StatusBadge({ status }: { status: StatusPengajuan }) {
    const meta = STATUS_META[status];
    const Icon = meta.icon;
    return (
        <span
            className={cn(
                "inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-lg font-bold",
                meta.className,
            )}
        >
            <Icon className="size-5" aria-hidden />
            {meta.label}
        </span>
    );
}

export function SubmissionHistory({
    items,
    emptyTitle,
    emptyText,
}: {
    items: RiwayatItem[];
    emptyTitle: string;
    emptyText: string;
}) {
    if (items.length === 0) {
        return (
            <div className="rounded-2xl border-2 border-dashed border-slate-400 bg-white p-10 text-center">
                <Inbox
                    className="mx-auto size-12 text-uca-green-800"
                    aria-hidden
                />
                <p className="mt-4 text-xl font-bold text-uca-green-900">
                    {emptyTitle}
                </p>
                <p className="mt-1 text-lg text-slate-700">{emptyText}</p>
            </div>
        );
    }

    return (
        <ul className="space-y-4">
            {items.map((item) => (
                <li
                    key={`${item.jenis ?? ""}-${item.id}`}
                    className="rounded-2xl border-2 border-slate-300 bg-white p-5 sm:p-6"
                >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            {item.jenis && (
                                <p className="text-lg font-bold text-uca-gold-800">
                                    {item.jenis}
                                </p>
                            )}
                            <h3 className="break-words text-xl font-bold leading-snug text-slate-900">
                                {item.judul}
                            </h3>
                        </div>
                        <StatusBadge status={item.status} />
                    </div>

                    <p className="mt-3 text-lg text-slate-800">
                        {item.keterangan}
                    </p>
                    <p className="mt-1 text-lg text-slate-600">
                        Dikirim pada {item.tanggal}
                    </p>

                    {item.catatan && (
                        <div className="mt-4 flex items-start gap-3 rounded-xl border-2 border-uca-orange-600 bg-uca-orange-100 p-4">
                            <MessageSquareWarning
                                className="mt-0.5 size-6 shrink-0 text-uca-orange-800"
                                aria-hidden
                            />
                            <div>
                                <p className="text-lg font-bold text-uca-orange-800">
                                    Catatan dari LPPM
                                </p>
                                <p className="text-lg text-slate-900">
                                    {item.catatan}
                                </p>
                            </div>
                        </div>
                    )}

                    {item.file_url && (
                        <a
                            href={item.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex items-center gap-2 rounded-lg text-lg font-bold text-uca-green-800 underline underline-offset-4 hover:text-uca-green-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-uca-orange-600"
                        >
                            <FileText className="size-6" aria-hidden />
                            Lihat berkas
                        </a>
                    )}
                </li>
            ))}
        </ul>
    );
}

/* Tab besar: "Ajukan baru" dan "Riwayat". */
export function PageTabs<T extends string>({
    tabs,
    value,
    onChange,
}: {
    tabs: { value: T; label: string; count?: number }[];
    value: T;
    onChange: (value: T) => void;
}) {
    return (
        <div
            role="tablist"
            className="flex gap-2 rounded-2xl border-2 border-slate-300 bg-white p-2"
        >
            {tabs.map((tab) => {
                const active = tab.value === value;
                return (
                    <button
                        key={tab.value}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(tab.value)}
                        className={cn(
                            "flex h-14 flex-1 items-center justify-center gap-3 rounded-xl px-3 text-lg font-bold transition-colors",
                            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-uca-orange-600",
                            active
                                ? "bg-uca-green-800 text-white"
                                : "text-uca-green-900 hover:bg-uca-green-50",
                        )}
                    >
                        {tab.label}
                        {tab.count !== undefined && (
                            <span
                                className={cn(
                                    "rounded-full px-3 py-0.5 text-base font-bold",
                                    active
                                        ? "bg-uca-gold-500 text-uca-green-900"
                                        : "bg-uca-gold-100 text-uca-gold-800",
                                )}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
