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
import { Head } from "@inertiajs/react";
import { Check, Users, X } from "lucide-react";
import { route } from "ziggy-js";
import { Fakultas } from "@/types/fakultas";

interface UserPageProps {
    users: PaginatedData<User>;
    totalUser: number;
    totalUppm: number;
    totalAdmin: number;
    fakultas: Fakultas[];
}

export default function UserPage({
    users,
    totalUser,
    totalUppm,
    totalAdmin,
    fakultas,
}: UserPageProps) {
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
                                    placeholder: "Contoh : admin@example.com",
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
                                                        small: "Kosongkan password dan konfirmasi password jika tidak ingin merubah password"
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
