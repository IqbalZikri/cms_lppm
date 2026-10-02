import DialogFormCreate, {
    DialogDelete,
    DialogFormEdit,
} from "@/components/dialog-form";
import Header from "@/components/header";
import StatisticsCard from "@/components/statistic-card";
import TablePage from "@/components/table-page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaginatedData } from "@/interface/pagination";
import { User as UserInterface } from "@/interface/user";
import { User } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Check, Users, X } from "lucide-react";
import { route } from "ziggy-js";
import { Fakultas } from "@/types/fakultas";
import { FormEvent, useState } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserPageProps {
    users: PaginatedData<User>;
    totalUser: number;
    totalUppm: number;
    totalAdmin: number;
    fakultas: Fakultas[];
    filters: any;
}

export default function UserPage({
    users,
    totalUser,
    totalUppm,
    totalAdmin,
    fakultas,
    filters,
}: UserPageProps) {
    const [search, setSearch] = useState(filters.search ?? "");

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            route("admin.user.index"),
            { search },
            { preserveState: true, replace: true },
        );
    };
    return (
        <>
            <Head title="User" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Header
                    breadcrumb={[
                        {
                            label: "User",
                            href: "admin.user.index",
                        },
                    ]}

                    page="User"
                />

                <StatisticsCard
                    dataCard={[
                        {
                            label: "Admin dan UPPM User Terdaftar",
                            count: totalUser,
                            icon: Users,
                        },
                        {
                            label: "Admin Terdaftar",
                            count: totalAdmin,
                            icon: Users,
                        },
                        {
                            label: "UPPM Terdaftar",
                            count: totalUppm,
                            icon: Users,
                        },
                    ]}
                />

                <Card>
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                                <Users className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>
                                    Daftar User Admin LPPM & UPPM
                                </CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi users LPPM & UPPM yang terdaftar
                                    dalam sistem.
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-3 items-center lg:block xl:flex">
                            <form
                                onSubmit={handleSearch}
                                className="flex gap-3 mb-[10px] xl:mb-[0px]"
                            >
                                <Field orientation={"horizontal"}>
                                    <Input
                                        type="search"
                                        placeholder="Cari Disini..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                    <Button type="submit">Cari</Button>
                                </Field>
                            </form>

                            <DialogFormCreate
                                page="User"
                                actionUrl="admin.user.store"
                                kolomInput={[
                                    {
                                        label: "Nama Akun",
                                        name: "name",
                                        placeholder: "Nama Akun",
                                        required: true,
                                    },
                                    {
                                        label: "Email",
                                        name: "email",
                                        placeholder:
                                            "Contoh : admin@example.com",
                                    },
                                    {
                                        label: "Password",
                                        name: "password",
                                        placeholder: "Password Akun",
                                        type: "password",
                                    },
                                    {
                                        label: "Konfirmasi Password",
                                        name: "password_confirmation",
                                        placeholder: "Konfirmasi Password",
                                        type: "password",
                                    },
                                    {
                                        label: "Hak Akses Akun / Role",
                                        name: "role",
                                        type: "radio",
                                        options: [
                                            { label: "Admin", value: "admin" },
                                            { label: "UPPM", value: "uppm" },
                                        ],
                                    },
                                    {
                                        label: "Fakultas",
                                        name: "fakultas_id",
                                        type: "select",
                                        showIf: { name: "role", value: "uppm" },
                                        options: fakultas.map((item) => ({
                                            label: item.nama_fakultas,
                                            value: item.id,
                                        })),
                                    },
                                ]}
                            />
                        </div>
                    </CardHeader>

                    <CardContent>
                        <TablePage<User>
                            data={users}
                            columns={[
                                {
                                    key: "name",
                                    label: "Nama User",
                                },
                                {
                                    key: "email",
                                    label: "Email",
                                },
                                {
                                    key: "email_verified_at",
                                    label: "Email Terverifikasi",
                                    render: (value) =>
                                        value ? (
                                            <Badge className="bg-green-500 text-white hover:bg-green-600">
                                                <Check /> Terverifikasi
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-red-500 text-white hover:bg-red-600">
                                                <X />
                                                Belum Terverifikasi
                                            </Badge>
                                        ),
                                },
                                {
                                    key: "role",
                                    label: "Hak Akses / Role",
                                },
                            ]}
                            renderActions={(item) => (
                                <div className="flex items-center gap-2">
                                    {item.id !== 1 && (
                                        <>
                                            <DialogFormEdit
                                                page="User"
                                                actionUrl={route(
                                                    "admin.user.update",
                                                    item.id,
                                                )}
                                                item={item}
                                                kolomInput={[
                                                    {
                                                        label: "Nama Akun",
                                                        name: "name",
                                                        placeholder:
                                                            "Nama Akun",
                                                        required: true,
                                                    },
                                                    {
                                                        label: "Email",
                                                        name: "email",
                                                        placeholder:
                                                            "Contoh : admin@example.com",
                                                    },
                                                    {
                                                        label: "Password",
                                                        name: "password",
                                                        placeholder:
                                                            "Password Akun",
                                                        type: "password",
                                                        small: "Kosongkan password dan konfirmasi password jika tidak ingin merubah password",
                                                    },
                                                    {
                                                        label: "Konfirmasi Password",
                                                        name: "password_confirmation",
                                                        placeholder:
                                                            "Konfirmasi Password",
                                                        type: "password",
                                                    },
                                                    {
                                                        label: "Hak Akses Akun / Role",
                                                        name: "role",
                                                        type: "radio",
                                                        options: [
                                                            {
                                                                label: "Admin",
                                                                value: "admin",
                                                            },
                                                            {
                                                                label: "UPPM",
                                                                value: "uppm",
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        label: "Fakultas",
                                                        name: "fakultas_id",
                                                        type: "select",
                                                        showIf: {
                                                            name: "role",
                                                            value: "uppm",
                                                        },
                                                        options: fakultas.map(
                                                            (item) => ({
                                                                label: item.nama_fakultas,
                                                                value: item.id,
                                                            }),
                                                        ),
                                                    },
                                                ]}
                                            />
                                            <DialogDelete
                                                actionUrl={route(
                                                    "admin.dosen.destroy",
                                                    item.id,
                                                )}
                                                page="user"
                                                item={item}
                                                label={item.name}
                                            />
                                        </>
                                    )}
                                </div>
                            )}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

UserPage.layout = {
    breadcrumbs: [
        {
            title: "User",
            href: route("admin.user.index"),
        },
    ],
};
