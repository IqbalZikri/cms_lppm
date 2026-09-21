import { ReactNode } from "react";
import { PaginatedData } from "@/interface/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "./ui/pagination";
import { Link, router } from "@inertiajs/react";

type ColumnDef<T> = {
    key: keyof T;
    label: string;
    // opsional: untuk kolom yang butuh transformasi, mis. fakultas_id -> nama_fakultas
    render?: (value: T[keyof T], item: T) => ReactNode;
};

type TablePageProps<T extends { id: number }> = {
    columns: ColumnDef<T>[];
    data: PaginatedData<T>;
    renderActions?: (item: T) => ReactNode; // tombol edit/hapus/dialog, ditentukan parent
};

export default function TablePage<T extends { id: number }>({
    columns,
    data,
    renderActions,
}: TablePageProps<T>) {
    const totalCols = columns.length + 1 + (renderActions ? 1 : 0);

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">No</TableHead>
                        {columns.map((col) => (
                            <TableHead key={String(col.key)}>
                                {col.label}
                            </TableHead>
                        ))}
                        {renderActions && <TableHead>Aksi</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={totalCols}
                                className="text-center"
                            >
                                Belum ada data.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.data.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    {(data.current_page - 1) * data.per_page +
                                        index +
                                        1}
                                </TableCell>
                                {columns.map((col) => (
                                    <TableCell key={String(col.key)}>
                                        {col.render
                                            ? col.render(item[col.key], item)
                                            : String(item[col.key] ?? "-")}
                                    </TableCell>
                                ))}
                                {renderActions && (
                                    <TableCell className="flex gap-[20px]">
                                        {renderActions(item)}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            {data.total >= 10 && (
                <Pagination className="mt-[20px]">
                    <PaginationContent>
                        {data.links.map((link, index) => {
                            // Previous
                            if (link.label.includes("Previous")) {
                                return (
                                    <PaginationItem key={index}>
                                        <PaginationPrevious
                                            href={link.url ?? "#"}
                                            aria-disabled={!link.url}
                                            className={
                                                !link.url
                                                    ? "pointer-events-none opacity-50"
                                                    : ""
                                            }
                                            onClick={(e) => {
                                                e.preventDefault();

                                                if (link.url) {
                                                    router.visit(link.url, {
                                                        preserveScroll: true,
                                                    });
                                                }
                                            }}
                                        />
                                    </PaginationItem>
                                );
                            }

                            // Next
                            if (link.label.includes("Next")) {
                                return (
                                    <PaginationItem key={index}>
                                        <PaginationNext
                                            href={link.url ?? "#"}
                                            aria-disabled={!link.url}
                                            className={
                                                !link.url
                                                    ? "pointer-events-none opacity-50"
                                                    : ""
                                            }
                                            onClick={(e) => {
                                                e.preventDefault();

                                                if (link.url) {
                                                    router.visit(link.url, {
                                                        preserveScroll: true,
                                                    });
                                                }
                                            }}
                                        />
                                    </PaginationItem>
                                );
                            }

                            // Ellipsis
                            if (link.label.includes("...")) {
                                return (
                                    <PaginationItem key={index}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }

                            // Nomor halaman
                            return (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href={link.url ?? "#"}
                                        isActive={link.active}
                                        aria-current={
                                            link.active ? "page" : undefined
                                        }
                                        aria-disabled={!link.url}
                                        className={
                                            !link.url
                                                ? "pointer-events-none opacity-50"
                                                : ""
                                        }
                                        onClick={(e) => {
                                            e.preventDefault();

                                            if (link.url) {
                                                router.visit(link.url, {
                                                    preserveScroll: true,
                                                });
                                            }
                                        }}
                                    >
                                        {link.label}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}
                    </PaginationContent>
                </Pagination>
            )}
        </>
    );
}
