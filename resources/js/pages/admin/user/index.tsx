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

interface UserPageProps {
    users: PaginatedData<User>;
    totalUser: number;
}

export default function UserPage({ users, totalUser }: UserPageProps) {
    const userAdmin = users.data.filter((item) => item.role === "admin").length;
    const userUppm = users.data.filter((item) => item.role === "uppm").length;
    const userDosen = users.data.filter((item) => item.role === "dosen").length;
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
                            label: "Total User Terdaftar",
                            count: totalUser,
                            icon: Users,
                        },
                        {
                            label: "Admin Terdaftar",
                            count: userAdmin,
                            icon: Users,
                        },
                        {
                            label: "UPPM Terdaftar",
                            count: userUppm,
                            icon: Users,
                        },
                        {
                            label: "Dosen Terdaftar",
                            count: userDosen,
                            icon: Users,
                        },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-center gap-3">
                                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                                    <Users className="h-5 w-5" />
                                </div>

                                <div>
                                    <CardTitle>Daftar User</CardTitle>

                                    <p className="text-muted-foreground mt-1 text-sm">
                                        Informasi user yang terdaftar dalam
                                        sistem.
                                    </p>
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
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
                            ]}
                        />
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
                                    key: "email_verification_at",
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
                            ]}
                            renderActions={(item) => (
                                {item.id === 1 }
                                <div className="flex items-center gap-2">
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
                                                placeholder: "Nama Akun",
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
