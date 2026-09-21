import {
    AlertCircle,
    Check,
    CheckCircle2,
    ChevronDown,
    Loader2,
    Send,
    Star,
    X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
    InputHTMLAttributes,
    ReactNode,
    TextareaHTMLAttributes,
} from "react";
import { BTN_PRIMARY, BTN_SECONDARY, countWords } from "@/lib/lppm";
import { cn } from "@/lib/utils";
import type { ChoiceOption } from "@/types/lppm";

/* ================================================================== */
/* Header halaman: satu-satunya elemen dekoratif, mengambil bulan sabit */
/* emas dan bintang oranye dari logo UCA.                              */
/* ================================================================== */
export function PageHeader({
    icon: Icon,
    title,
    description,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
}) {
    return (
        <header className="relative overflow-hidden rounded-3xl bg-uca-green-800 px-6 py-8 text-white sm:px-10 sm:py-10">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 hidden w-72 sm:block"
            >
                <svg
                    viewBox="0 0 300 220"
                    preserveAspectRatio="xMaxYMid slice"
                    className="h-full w-full"
                >
                    <defs>
                        <mask id="uca-crescent-mask">
                            <rect width="300" height="220" fill="white" />
                            <circle cx="232" cy="104" r="112" fill="black" />
                        </mask>
                    </defs>
                    <circle
                        cx="200"
                        cy="110"
                        r="130"
                        fill="#C6A25A"
                        mask="url(#uca-crescent-mask)"
                    />
                </svg>
                <Star className="absolute right-14 top-7 size-9 fill-uca-orange-500 text-uca-orange-500" />
            </div>

            <div className="relative max-w-xl">
                <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-uca-gold-500 text-uca-green-900">
                    <Icon className="size-8" aria-hidden />
                </span>
                <h1 className="font-uca-title text-3xl font-bold leading-tight sm:text-4xl">
                    {title}
                </h1>
                <p className="mt-3 text-lg leading-relaxed text-white/90 sm:text-xl">
                    {description}
                </p>
            </div>
        </header>
    );
}

/* ================================================================== */
/* Pembungkus bagian formulir                                          */
/* ================================================================== */
export function FormSection({
    step,
    title,
    description,
    children,
}: {
    step?: number;
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section className="rounded-2xl border-2 border-slate-300 bg-white p-6 sm:p-8">
            <header className="mb-7 flex items-start gap-4">
                {step !== undefined && (
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-uca-green-800 text-xl font-bold text-white">
                        {step}
                    </span>
                )}
                <div>
                    <h2 className="font-uca-title text-2xl font-bold text-uca-green-900">
                        {title}
                    </h2>
                    {description && (
                        <p className="mt-1 text-lg text-slate-700">
                            {description}
                        </p>
                    )}
                </div>
            </header>
            <div className="space-y-8">{children}</div>
        </section>
    );
}

/* ================================================================== */
/* Field: label + petunjuk + pesan kesalahan                           */
/* ================================================================== */
const labelClass = "block text-xl font-bold text-uca-green-900";

export function Field({
    label,
    htmlFor,
    labelId,
    required,
    hint,
    error,
    children,
}: {
    label: string;
    htmlFor?: string;
    labelId?: string;
    required?: boolean;
    hint?: string;
    error?: string;
    children: ReactNode;
}) {
    const ref = htmlFor ?? labelId ?? label;
    const labelContent = (
        <>
            {label}{" "}
            {required ? (
                <span className="text-lg font-bold text-uca-orange-600">
                    (wajib diisi)
                </span>
            ) : (
                <span className="text-lg font-medium text-slate-600">
                    (boleh dikosongkan)
                </span>
            )}
        </>
    );

    return (
        <div className="space-y-2">
            {htmlFor ? (
                <label htmlFor={htmlFor} className={labelClass}>
                    {labelContent}
                </label>
            ) : (
                <p id={labelId} className={labelClass}>
                    {labelContent}
                </p>
            )}
            {hint && (
                <p id={`${ref}-hint`} className="text-lg text-slate-700">
                    {hint}
                </p>
            )}
            {children}
            {error && (
                <p
                    id={`${ref}-error`}
                    role="alert"
                    className="flex items-start gap-2 text-lg font-bold text-red-800"
                >
                    <AlertCircle
                        className="mt-0.5 size-6 shrink-0"
                        aria-hidden
                    />
                    {error}
                </p>
            )}
        </div>
    );
}

/* ================================================================== */
/* Kontrol isian                                                       */
/* ================================================================== */
const controlClass = (invalid?: boolean) =>
    cn(
        "w-full rounded-xl border-2 bg-white px-4 text-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-4",
        invalid
            ? "border-red-700 focus:border-red-700 focus:ring-red-700/25"
            : "border-slate-500 focus:border-uca-green-800 focus:ring-uca-green-800/25",
    );

type ControlProps = { id: string; invalid?: boolean };

export function TextInput({
    id,
    invalid,
    className,
    ...props
}: ControlProps & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            id={id}
            name={id}
            aria-invalid={invalid || undefined}
            aria-describedby={`${id}-hint ${id}-error`}
            className={cn(controlClass(invalid), "h-14", className)}
            {...props}
        />
    );
}

export function TextArea({
    id,
    invalid,
    value,
    recommendedWords,
    className,
    ...props
}: ControlProps &
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value"> & {
        value: string;
        recommendedWords?: [number, number];
    }) {
    const words = countWords(value);
    const inRange = recommendedWords
        ? words >= recommendedWords[0] && words <= recommendedWords[1]
        : false;

    return (
        <div>
            <textarea
                id={id}
                name={id}
                value={value}
                aria-invalid={invalid || undefined}
                aria-describedby={`${id}-hint ${id}-error`}
                className={cn(
                    controlClass(invalid),
                    "py-3 leading-relaxed",
                    className,
                )}
                {...props}
            />
            {recommendedWords && (
                <p
                    className={cn(
                        "mt-2 flex items-center gap-2 text-lg",
                        inRange
                            ? "font-bold text-uca-green-800"
                            : "text-slate-700",
                    )}
                >
                    {inRange && <Check className="size-6" aria-hidden />}
                    {words} kata. Disarankan {recommendedWords[0]} sampai{" "}
                    {recommendedWords[1]} kata.
                </p>
            )}
        </div>
    );
}

export function SelectField({
    id,
    value,
    onChange,
    options,
    placeholder = "Pilih salah satu",
    invalid,
}: ControlProps & {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
}) {
    return (
        <div className="relative">
            <select
                id={id}
                name={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-invalid={invalid || undefined}
                aria-describedby={`${id}-hint ${id}-error`}
                className={cn(
                    controlClass(invalid),
                    "h-14 cursor-pointer appearance-none pr-14",
                    value === "" && "text-slate-600",
                )}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((o) => (
                    <option
                        key={o.value}
                        value={o.value}
                        className="text-slate-900"
                    >
                        {o.label}
                    </option>
                ))}
            </select>
            <ChevronDown
                className="pointer-events-none absolute right-4 top-1/2 size-7 -translate-y-1/2 text-uca-green-800"
                aria-hidden
            />
        </div>
    );
}

/** Input rupiah: menampilkan titik ribuan (15.000.000), menyimpan angka saja (15000000). */
export function CurrencyInput({
    id,
    value,
    onChange,
    invalid,
}: ControlProps & { value: string; onChange: (digits: string) => void }) {
    const display = value ? Number(value).toLocaleString("id-ID") : "";

    return (
        <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-uca-green-800">
                Rp
            </span>
            <input
                id={id}
                name={id}
                inputMode="numeric"
                autoComplete="off"
                placeholder="0"
                value={display}
                onChange={(e) =>
                    onChange(
                        e.target.value
                            .replace(/\D/g, "")
                            .replace(/^0+(?=\d)/, ""),
                    )
                }
                aria-invalid={invalid || undefined}
                aria-describedby={`${id}-hint ${id}-error`}
                className={cn(
                    controlClass(invalid),
                    "h-14 pl-14 text-xl font-bold",
                )}
            />
        </div>
    );
}

/* ================================================================== */
/* Kartu pilihan (pengganti radio kecil): area sentuh besar            */
/* ================================================================== */
export function ChoiceCards<T extends string>({
    name,
    label,
    hint,
    required,
    error,
    value,
    onChange,
    options,
    columns = 2,
}: {
    name: string;
    label: string;
    hint?: string;
    required?: boolean;
    error?: string;
    value: T | "";
    onChange: (value: T) => void;
    options: ChoiceOption<T>[];
    columns?: 2 | 3;
}) {
    return (
        <Field
            label={label}
            labelId={`${name}-label`}
            hint={hint}
            required={required}
            error={error}
        >
            <div
                id={name}
                tabIndex={-1}
                role="radiogroup"
                aria-labelledby={`${name}-label`}
                className={cn(
                    "grid gap-3 focus:outline-none",
                    columns === 3 ? "md:grid-cols-3" : "sm:grid-cols-2",
                )}
            >
                {options.map((opt) => {
                    const checked = value === opt.value;
                    const Icon = opt.icon;
                    return (
                        <label key={opt.value} className="block cursor-pointer">
                            <input
                                type="radio"
                                name={name}
                                value={opt.value}
                                checked={checked}
                                onChange={() => onChange(opt.value)}
                                className="peer sr-only"
                            />
                            <span
                                className={cn(
                                    "flex h-full min-h-20 items-center gap-4 rounded-xl border-2 p-4 transition-colors",
                                    "peer-focus-visible:ring-4 peer-focus-visible:ring-uca-orange-600 peer-focus-visible:ring-offset-2",
                                    checked
                                        ? "border-uca-green-800 bg-uca-green-50"
                                        : "border-slate-500 bg-white hover:border-uca-green-700",
                                )}
                            >
                                <span
                                    aria-hidden
                                    className={cn(
                                        "grid size-8 shrink-0 place-items-center rounded-full border-2",
                                        checked
                                            ? "border-uca-green-800 bg-uca-green-800 text-white"
                                            : "border-slate-500 bg-white",
                                    )}
                                >
                                    {checked && (
                                        <Check
                                            className="size-5"
                                            strokeWidth={3}
                                        />
                                    )}
                                </span>
                                {Icon && (
                                    <Icon
                                        className="size-8 shrink-0 text-uca-green-800"
                                        aria-hidden
                                    />
                                )}
                                <span className="block">
                                    <span className="block text-xl font-bold text-uca-green-900">
                                        {opt.label}
                                    </span>
                                    {opt.description && (
                                        <span className="block text-lg leading-snug text-slate-700">
                                            {opt.description}
                                        </span>
                                    )}
                                </span>
                            </span>
                        </label>
                    );
                })}
            </div>
        </Field>
    );
}

/* ================================================================== */
/* Bilah tombol kirim                                                  */
/* ================================================================== */
export function SubmitBar({
    processing,
    label,
    onReset,
}: {
    processing: boolean;
    label: string;
    onReset: () => void;
}) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-lg sm:flex-row sm:items-center sm:justify-between lg:sticky lg:bottom-4">
            <p className="text-lg text-slate-800">
                Periksa kembali isian Anda sebelum mengirim.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={onReset}
                    disabled={processing}
                    className={BTN_SECONDARY}
                >
                    Kosongkan isian
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className={BTN_PRIMARY}
                >
                    {processing ? (
                        <Loader2 className="size-6 animate-spin" aria-hidden />
                    ) : (
                        <Send className="size-6" aria-hidden />
                    )}
                    {processing ? "Sedang mengirim…" : label}
                </button>
            </div>
        </div>
    );
}

/* ================================================================== */
/* Pemberitahuan berhasil                                              */
/* ================================================================== */
export function SuccessBanner({
    title,
    children,
    onClose,
}: {
    title: string;
    children: ReactNode;
    onClose: () => void;
}) {
    return (
        <div
            role="status"
            className="flex items-start gap-4 rounded-2xl border-2 border-uca-green-800 bg-uca-green-50 p-5"
        >
            <CheckCircle2
                className="mt-0.5 size-8 shrink-0 text-uca-green-800"
                aria-hidden
            />
            <div className="flex-1">
                <p className="text-xl font-bold text-uca-green-900">{title}</p>
                <p className="mt-1 text-lg text-slate-800">{children}</p>
            </div>
            <button
                type="button"
                onClick={onClose}
                aria-label="Tutup pemberitahuan"
                className="grid size-11 shrink-0 place-items-center rounded-xl text-uca-green-900 hover:bg-uca-green-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-uca-orange-600"
            >
                <X className="size-6" aria-hidden />
            </button>
        </div>
    );
}
