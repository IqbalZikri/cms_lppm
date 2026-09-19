import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Icon } from "./ui/icon";

interface DataCard {
    label: string;
    count: number;
    icon?: LucideIcon;
}

interface StatisticsCardProps {
    dataCard: DataCard[];
}

export default function StatisticsCard({ dataCard }: StatisticsCardProps) {
    return (
        <>
            <div
                className={`grid gap-4 md:grid-cols-2 ${
                    dataCard.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
                }`}
            >
                {dataCard.map((item) => {
                    const icon = item.icon;
                    return (
                        <Card key={item.label}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total {item.label}
                                </CardTitle>

                                {icon && (
                                    <Icon className="text-muted-foreground h-5 w-5" />
                                )}
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {item.count}
                                </div>

                                <p className="text-muted-foreground text-xs">
                                    Seluruh dosen terdaftar
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </>
    );
}
