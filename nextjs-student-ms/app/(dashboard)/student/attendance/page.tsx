import React from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { AttendanceCard } from "@/components/student/AttendanceCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function StudentAttendancePage() {
  const attendanceLogs = [
    { date: "Oct 24, 2026", status: "present" as const, remarks: "On time" },
    { date: "Oct 23, 2026", status: "present" as const, remarks: "On time" },
    { date: "Oct 22, 2026", status: "late" as const, remarks: "15 mins late - Transit delay" },
    { date: "Oct 21, 2026", status: "excused" as const, remarks: "Doctor appointment" },
    { date: "Oct 20, 2026", status: "absent" as const, remarks: "Unexcused" },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="My Attendance History"
        text="View your daily class attendance logs and status breakdown."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3.5 sm:p-6">
          <CardHeader className="p-0 pb-1 sm:pb-2">
            <CardTitle className="text-[11px] sm:text-xs text-muted-foreground font-medium">Overall Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xl sm:text-2xl font-bold text-success">92.5%</div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1">Above 85% goal</p>
          </CardContent>
        </Card>
        <Card className="p-3.5 sm:p-6">
          <CardHeader className="p-0 pb-1 sm:pb-2">
            <CardTitle className="text-[11px] sm:text-xs text-muted-foreground font-medium">Present Days</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xl sm:text-2xl font-bold text-foreground">42</div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1">Total recorded</p>
          </CardContent>
        </Card>
        <Card className="p-3.5 sm:p-6">
          <CardHeader className="p-0 pb-1 sm:pb-2">
            <CardTitle className="text-[11px] sm:text-xs text-muted-foreground font-medium">Late Days</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xl sm:text-2xl font-bold text-warning">3</div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1">With remarks</p>
          </CardContent>
        </Card>
        <Card className="p-3.5 sm:p-6">
          <CardHeader className="p-0 pb-1 sm:pb-2">
            <CardTitle className="text-[11px] sm:text-xs text-muted-foreground font-medium">Absences</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xl sm:text-2xl font-bold text-destructive">1</div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1">Unexcused</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Recent Daily Logs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {attendanceLogs.map((log, index) => (
            <AttendanceCard key={index} {...log} />
          ))}
        </div>
      </div>
    </div>
  );
}
