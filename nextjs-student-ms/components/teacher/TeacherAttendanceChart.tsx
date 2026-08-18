"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

interface DayData {
  dayName: string;
  rate: number;
  total: number;
  present: number;
}

interface TeacherAttendanceChartProps {
  data: DayData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border px-3 py-2 rounded-xl shadow-lg text-xs space-y-1">
        <p className="font-bold text-foreground">{label}</p>
        <p className="text-primary font-semibold">
          Presence Rate: <span className="font-bold">{item.rate}%</span>
        </p>
        {item.total > 0 && (
          <p className="text-muted-foreground text-[11px]">
            {item.present} present out of {item.total} recorded
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function TeacherAttendanceChart({ data }: TeacherAttendanceChartProps) {
  return (
    <div className="w-full h-56 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            className="stroke-border/40"
          />
          <XAxis
            dataKey="dayName"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)/30" }} />
          <Bar
            dataKey="rate"
            radius={[6, 6, 0, 0]}
            maxBarSize={44}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.rate >= 80
                    ? "var(--primary)"
                    : entry.rate >= 60
                    ? "#3b82f6"
                    : "#f59e0b"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
