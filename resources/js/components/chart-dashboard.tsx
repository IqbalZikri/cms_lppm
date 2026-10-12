"use client";

import * as React from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";

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
    tahun: number;
    kegiatan: number;
    pkm: number;
    hki: number;
    luaran_jurnal: number;
    prosiding: number;
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
    buku: { label: "Buku", color: "var(--chart-6)" },
} satisfies ChartConfig;

const keys = Object.keys(chartConfig) as (keyof typeof chartConfig)[];

const RANGE_OPTIONS = [
    { value: "5y", label: "5 tahun terakhir", years: 5 },
    { value: "3y", label: "3 tahun terakhir", years: 3 },
    { value: "1y", label: "1 tahun terakhir", years: 1 },
] as const;

export function ChartDashboard({ chartData }: Props) {
    const [timeRange, setTimeRange] = React.useState<string>("5y");

    const selected =
        RANGE_OPTIONS.find((o) => o.value === timeRange) ?? RANGE_OPTIONS[0];

    const filteredData = React.useMemo(() => {
        if (chartData.length === 0) return [];
        const lastYear = chartData[chartData.length - 1].tahun;
        return chartData.filter(
            (item) => item.tahun > lastYear - selected.years,
        );
    }, [chartData, selected.years]);

    // area chart butuh minimal 2 titik, kalau cuma 1 tahun pakai bar chart
    const useBar = filteredData.length < 2;

    const xAxis = (
        <XAxis
            dataKey="tahun"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={0}
            tickFormatter={(value) => String(value)}
        />
    );

    const tooltip = (
        <ChartTooltip
            cursor={false}
            content={
                <ChartTooltipContent
                    labelFormatter={(value) => `Tahun ${value}`}
                    indicator="dot"
                />
            }
        />
    );

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Area Chart - Penelitian</CardTitle>
                    <CardDescription>
                        Menampilkan total penelitian per tahun ({selected.label}
                        ).
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="hidden w-[180px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Pilih rentang waktu"
                    >
                        <SelectValue placeholder="5 tahun terakhir" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        {RANGE_OPTIONS.map((o) => (
                            <SelectItem
                                key={o.value}
                                value={o.value}
                                className="rounded-lg"
                            >
                                {o.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    {useBar ? (
                        <BarChart data={filteredData}>
                            <CartesianGrid vertical={false} />
                            {xAxis}
                            <YAxis allowDecimals={false} width={32} />
                            {tooltip}
                            {keys.map((key) => (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    fill={`var(--color-${key})`}
                                    stackId="a"
                                />
                            ))}
                            <ChartLegend content={<ChartLegendContent />} />
                        </BarChart>
                    ) : (
                        <AreaChart data={filteredData}>
                            <defs>
                                {keys.map((key) => (
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
                            {xAxis}
                            <YAxis allowDecimals={false} width={32} />
                            {tooltip}
                            {keys.map((key) => (
                                <Area
                                    key={key}
                                    dataKey={key}
                                    type="monotone"
                                    fill={`url(#fill-${key})`}
                                    stroke={`var(--color-${key})`}
                                    stackId="a"
                                />
                            ))}
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    )}
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
