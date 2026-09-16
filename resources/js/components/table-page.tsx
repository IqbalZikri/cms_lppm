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
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">No</TableHead>
                    {columns.map((col) => (
                        <TableHead key={String(col.key)}>{col.label}</TableHead>
                    ))}
                    {renderActions && (
                        <TableHead>Aksi</TableHead>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={totalCols} className="text-center">
                            Belum ada data.
                        </TableCell>
                    </TableRow>
                ) : (
                    data.data.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
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
    );
}