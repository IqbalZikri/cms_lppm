"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const description = "chart penelitian";

export interface ChartPoint {
    date: string;
    kegiatan: number;
    pkm: number;
    hki: number;
    luaran_jurnal: number;
    prosiding: number;
    tahun: number;
}

interface Props {
    chartData: ChartPoint[];
}

const chartConfig = {
    kegiatan: { label: "Kegiatan", color: "var(--chart-1)" },
    pkm: { label: "PKM", color: "var(--chart-2)" },
    hki: { label: "HKI", color: "var(--chart-3)" },
    luaran_jurnal: { label: "Luaran Jurnal", color: "var(--chart-4)" },
    prosiding: { label: "Prosiding", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function ChartAreaInteractive({ chartData }: Props) {
    const [timeRange, setTimeRange] = React.useState("3y");

    const filteredData = React.useMemo(() => {
        if (chartData.length === 0) return [];
        const yearsToShow = timeRange === "1y" ? 1 : timeRange === "5y" ? 5 : 3;
        const lastYear = chartData[chartData.length - 1].tahun;
        return chartData.filter((item) => item.tahun > lastYear - yearsToShow);
    }, [chartData, timeRange]);

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Area Chart - Penelitian</CardTitle>
                    <CardDescription>
                        Menampilan total penelitian selama 3 bulan terakhir.
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            {(
                                Object.keys(
                                    chartConfig,
                                ) as (keyof typeof chartConfig)[]
                            ).map((key) => (
                                <linearGradient
                                    key={key}
                                    id={`fill-${key}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={`var(--color-${key})`}
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={`var(--color-${key})`}
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) =>
                                new Date(value).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString(
                                            "en-US",
                                            { month: "short", day: "numeric" },
                                        )
                                    }
                                    indicator="dot"
                                />
                            }
                        />
                        {(
                            Object.keys(
                                chartConfig,
                            ) as (keyof typeof chartConfig)[]
                        ).map((key) => (
                            <Area
                                key={key}
                                dataKey={key}
                                type="natural"
                                fill={`url(#fill-${key})`}
                                stroke={`var(--color-${key})`}
                                stackId="a"
                            />
                        ))}
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
