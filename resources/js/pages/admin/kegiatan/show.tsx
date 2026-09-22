import { Kegiatan } from "@/interface/kegiatan";
import { Head } from "@inertiajs/react";

interface Props {
    data: Kegiatan;
}
export default function ShowKegiatan({ data }: Props) {
    return (
        <>
            <Head title="Detail Kegiatan Penelitian" />
        </>
    );
}

ShowKegiatan.layout = {
    breadcrumbs: [
        {
            title: "Detail Kegiatan Penelitian",
        },
    ],
};
