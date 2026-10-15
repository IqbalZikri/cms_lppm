import { Dosen } from "@/types/dosen";
import type { InertiaLinkProps } from "@inertiajs/react";
import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps["href"]>): string {
    return typeof url === "string" ? url : url.url;
}

export function toTitleCase(text: string): string {
    return text
        .toLowerCase()
        .replace(/(^|\s)\S/g, (huruf) => huruf.toUpperCase());
}

export function formatNamaDosen(dosen: Dosen) {
    return [
        dosen.gelar_depan,
        toTitleCase(dosen.nama_dosen),
        dosen.gelar_belakang,
    ]
        .filter(Boolean)
        .join(" ");
}
