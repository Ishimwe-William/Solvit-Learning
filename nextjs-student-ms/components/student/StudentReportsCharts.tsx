"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

interface AttendanceStatusData {
  name: string;
  count: number;
  color: string;
}

interface LeaveCategoryData {
  name: string;
  value: number;
  color: string;
}

interface StudentReportsChartsProps {
  attendanceData: AttendanceStatusData[];
  leaveData: LeaveCategoryData[];
}

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border px-3 py-2 rounded-xl shadow-lg text-xs">
        <p className="font-bold text-foreground">{label}</p>
        <p className="text-primary font-semibold">
          Count: <span className="font-bold">{payload[0].value}</span> sessions
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border px-3 py-2 rounded-xl shadow-lg text-xs">
        <p className="font-bold text-foreground">{data.name}</p>
        <p style={{ color: data.payload.color }} className="font-semibold">
          Total: {data.value} requests
        </p>
      </div>
    );
  }
  return null;
};

export function StudentAttendanceBarChart({
  data,
}: {
  data: AttendanceStatusData[];
}) {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  if (total === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-xs text-muted-foreground bg-muted/20 rounded-xl">
        No attendance sessions recorded yet.
      </div>
    );
  }

  return (
    <div className="w-full h-56 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          />
          <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "var(--muted)/30" }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48} animationDuration={800}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StudentLeaveDonutChart({
  data,
}: {
  data: LeaveCategoryData[];
}) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  if (total === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-xs text-muted-foreground bg-muted/20 rounded-xl">
        No leave applications submitted yet.
      </div>
    );
  }

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomPieTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "12px" }}
          />
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={48}
            outerRadius={72}
            paddingAngle={4}
            dataKey="value"
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
