import { DialogDelete } from "@/components/dialog-form";
import Header from "@/components/header";
import StatisticsCard from "@/components/statistic-card";
import TablePage from "@/components/table-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PaginatedData } from "@/interface/pagination";
import { Pkm as PkmInterface } from "@/interface/pkm";
import { Head, Link, router } from "@inertiajs/react";
import { HandHeart, Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { route } from "ziggy-js";

interface Props {
    data: PaginatedData<PkmInterface>;
    filters: any;
    totalPkm: number;
    totalPkmPerFakultas: string[];
}

export default function Pkm({
    data,
    filters,
    totalPkm,
    totalPkmPerFakultas,
}: Props) {
    const statistikFakultas = totalPkmPerFakultas.map((item: any) => ({
        label: item.label,
        count: item.count,
    }));

    const [search, setSearch] = useState(filters.search ?? "");

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            route("admin.pkm.index"),
            { search },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Pengabdian Kepaga Masyarakat" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Header
                    page="Pengabdian Kepada Masyarakat"
                    breadcrumb={[
                        {
                            label: "PKM",
                            href: "admin.pkm.index",
                        },
                    ]}
                />
                <StatisticsCard
                    dataCard={[
                        {
                            label: "Total PKM",
                            count: totalPkm,
                        },
                        ...statistikFakultas,
                    ]}
                />

                <Card>
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                                <HandHeart className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>
                                    Daftar Pengabdian Kepada Masyarakat ( PKM )
                                </CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi pengabdian kepada masyarakat yang
                                    terdaftar dalam sistem.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 items-center lg:block xl:flex">
                            <form
                                onSubmit={handleSearch}
                                className="flex gap-3 mb-[10px] xl:mb-[0px]"
                            >
                                <Field orientation="horizontal">
                                    <Input
                                        type="search"
                                        placeholder="Search..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                    <Button type="submit">Search</Button>
                                </Field>
                            </form>

                            <Link
                                href={route("admin.pkm.create")}
                                viewTransition
                                className="w-full sm:w-auto"
                            >
                                <Button className="w-full sm:w-auto">
                                    <Plus />
                                    Tambah PKM
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <TablePage<PkmInterface>
                            data={data}
                            columns={[
                                {
                                    key: "judul",
                                    label: "Judul",
                                },
                                {
                                    id: "fakultas",
                                    key: "penulis",
                                    label: "Fakultas",
                                    render: (_, item) =>
                                        item.penulis.map((penulis, i) => (
                                            <Badge key={i} className="mr-2">
                                                {penulis.fakultas.nama_fakultas}
                                            </Badge>
                                        )),
                                },
                                {
                                    id: "dosen",
                                    key: "penulis",
                                    label: "Dosen",
                                    render: (_, item) =>
                                        item.penulis.map((penulis, i) => (
                                            <Badge
                                                key={i}
                                                className="mr-2 rounded-md px-2 py-1 text-xs"
                                            >
                                                {penulis.dosen.nama_dosen}
                                            </Badge>
                                        )),
                                },
                            ]}
                            renderActions={(item) => (
                                <>
                                    <Link
                                        href={route("admin.pkm.edit", item.id)}
                                        viewTransition
                                    >
                                        <Button variant={"outline"}>
                                            Edit
                                        </Button>
                                    </Link>
                                    <Link
                                        href={route("admin.pkm.show", item.id)}
                                        viewTransition
                                    >
                                        <Button>Show</Button>
                                    </Link>
                                    <DialogDelete
                                        label={item.judul}
                                        actionUrl={route(
                                            "admin.pkm.destroy",
                                            item.id,
                                        )}
                                        page="Penelitian Pengabdian Kepada Masyarakat"
                                        item={item}
                                    />
                                </>
                            )}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Pkm.layout = {
    breadcrumbs: [
        {
            title: "Pengabdian Kepada Masyarakat",
        },
    ],
};
