import { AlertCircle, FileText, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import type { DragEvent } from "react";
import {
    BTN_DANGER,
    BTN_PRIMARY,
    BTN_SECONDARY,
    MAX_UPLOAD_MB,
    formatSize,
} from "@/lib/lppm";
import { cn } from "@/lib/utils";

type Props = {
    /** Dipakai sebagai id tombol "Pilih file" agar bisa difokuskan saat ada kesalahan. */
    id: string;
    file: File | null;
    onChange: (file: File | null) => void;
    accept?: string[];
    acceptLabel?: string;
    maxMB?: number;
    invalid?: boolean;
};

export default function FileDropzone({
    id,
    file,
    onChange,
    accept = [".pdf"],
    acceptLabel = "PDF",
    maxMB = MAX_UPLOAD_MB,
    invalid,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const choose = (picked?: File) => {
        if (inputRef.current) inputRef.current.value = ""; // agar file yang sama bisa dipilih lagi
        if (!picked) return;

        const ext = `.${picked.name.split(".").pop()?.toLowerCase() ?? ""}`;
        if (!accept.includes(ext)) {
            setLocalError(
                `Format file harus ${acceptLabel}. File yang Anda pilih berformat ${ext}.`,
            );
            return;
        }
        if (picked.size > maxMB * 1024 * 1024) {
            setLocalError(
                `Ukuran file ${formatSize(picked.size)} terlalu besar. Batas maksimal ${maxMB} MB.`,
            );
            return;
        }
        setLocalError(null);
        onChange(picked);
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        choose(e.dataTransfer.files?.[0]);
    };

    const openPicker = () => inputRef.current?.click();

    return (
        <div>
            <input
                ref={inputRef}
                id={`${id}-input`}
                type="file"
                accept={accept.join(",")}
                tabIndex={-1}
                aria-hidden
                className="sr-only"
                onChange={(e) => choose(e.target.files?.[0])}
            />

            {file ? (
                <div className="flex flex-col gap-4 rounded-xl border-2 border-uca-green-800 bg-uca-green-50 p-5 sm:flex-row sm:items-center">
                    <FileText
                        className="size-10 shrink-0 text-uca-green-800"
                        aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                        <p className="break-words text-lg font-bold text-slate-900">
                            {file.name}
                        </p>
                        <p className="text-lg text-slate-700">
                            {formatSize(file.size)}, siap dikirim
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            id={id}
                            onClick={openPicker}
                            className={cn(BTN_SECONDARY, "h-12 px-5")}
                        >
                            Ganti file
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setLocalError(null);
                                onChange(null);
                            }}
                            className={cn(BTN_DANGER, "h-12 px-5")}
                        >
                            <Trash2 className="size-5" aria-hidden />
                            Hapus
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    className={cn(
                        "rounded-xl border-2 border-dashed p-6 text-center",
                        dragging
                            ? "border-uca-green-800 bg-uca-green-50"
                            : invalid || localError
                              ? "border-red-700 bg-red-50"
                              : "border-slate-500 bg-white",
                    )}
                >
                    <Upload
                        className="mx-auto size-10 text-uca-green-800"
                        aria-hidden
                    />
                    <button
                        type="button"
                        id={id}
                        onClick={openPicker}
                        className={cn(BTN_PRIMARY, "mt-4")}
                    >
                        Pilih file
                    </button>
                    <p className="mt-3 text-lg text-slate-800">
                        atau tarik file ke kotak ini
                    </p>
                    <p className="mt-1 text-lg text-slate-600">
                        Format {acceptLabel}, ukuran maksimal {maxMB} MB
                    </p>
                </div>
            )}

            {localError && (
                <p
                    role="alert"
                    className="mt-2 flex items-start gap-2 text-lg font-bold text-red-800"
                >
                    <AlertCircle
                        className="mt-0.5 size-6 shrink-0"
                        aria-hidden
                    />
                    {localError}
                </p>
            )}
        </div>
    );
}
