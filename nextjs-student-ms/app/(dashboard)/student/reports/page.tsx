import React from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import {
  IoDownloadOutline,
  IoBarChartOutline,
  IoPieChartOutline,
  IoCheckmarkDoneCircleOutline,
} from "react-icons/io5";
import {
  StudentAttendanceBarChart,
  StudentLeaveDonutChart,
} from "@/components/student/StudentReportsCharts";

export default async function StudentReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let attendanceLogs: any[] = [];
  let leaveRequests: any[] = [];

  if (user) {
    const [{ data: attData }, { data: leaveData }] = await Promise.all([
      supabase
        .from("attendance_records")
        .select("*")
        .eq("student_id", user.id),

      supabase
        .from("leave_requests")
        .select("*")
        .eq("student_id", user.id),
    ]);

    attendanceLogs = attData || [];
    leaveRequests = leaveData || [];
  }

  const totalSessions = attendanceLogs.length;
  const presentCount = attendanceLogs.filter((r) => r.status === "present").length;
  const lateCount = attendanceLogs.filter((r) => r.status === "late").length;
  const absentCount = attendanceLogs.filter((r) => r.status === "absent").length;
  const excusedCount = attendanceLogs.filter((r) => r.status === "excused").length;

  const attendanceRate =
    totalSessions > 0
      ? (((presentCount + lateCount * 0.8 + excusedCount) / totalSessions) * 100).toFixed(1)
      : "100.0";

  const sickLeaves = leaveRequests.filter((l) => l.type === "sick").length;
  const personalLeaves = leaveRequests.filter((l) => l.type === "personal").length;
  const emergencyLeaves = leaveRequests.filter((l) => l.type === "emergency").length;
  const approvedLeaves = leaveRequests.filter((l) => l.status === "approved").length;

  const attendanceChartData = [
    { name: "Present", count: presentCount, color: "#16a34a" },
    { name: "Late", count: lateCount, color: "#d97706" },
    { name: "Absent", count: absentCount, color: "#dc2626" },
    { name: "Excused", count: excusedCount, color: "#0284c7" },
  ];

  const leaveChartData = [
    { name: "Medical", value: sickLeaves, color: "#ef4444" },
    { name: "Personal", value: personalLeaves, color: "#3b82f6" },
    { name: "Emergency", value: emergencyLeaves, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Attendance Reports & Statistics"
        text="Live analytical breakdown and statistical overview of your attendance performance."
      >
        <Button variant="outline" size="sm" className="w-full sm:w-auto gap-1.5 font-medium">
          <IoDownloadOutline size={16} />
          <span>Export Summary</span>
        </Button>
      </DashboardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <CardHeader className="mb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm sm:text-base font-bold">Attendance Distribution</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Presence Rate: <span className="font-bold text-success">{attendanceRate}%</span>
              </p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <IoBarChartOutline size={18} />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <StudentAttendanceBarChart data={attendanceChartData} />
            <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-muted-foreground flex-wrap">
              <span>Present: <strong className="text-foreground">{presentCount}</strong></span>
              <span>•</span>
              <span>Late: <strong className="text-foreground">{lateCount}</strong></span>
              <span>•</span>
              <span>Absent: <strong className="text-foreground">{absentCount}</strong></span>
              <span>•</span>
              <span>Excused: <strong className="text-foreground">{excusedCount}</strong></span>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardHeader className="mb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm sm:text-base font-bold">Leave Requests Breakdown</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Total Submitted: <strong className="text-foreground">{leaveRequests.length}</strong> ({approvedLeaves} approved)
              </p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <IoPieChartOutline size={18} />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <StudentLeaveDonutChart data={leaveChartData} />
          </CardContent>
        </Card>
      </div>

      <Card className="p-4 sm:p-6">
        <CardHeader className="mb-3 sm:mb-4">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <IoCheckmarkDoneCircleOutline size={18} className="text-success" />
            <span>Academic Performance Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-xs sm:text-sm text-foreground list-disc list-inside">
            <li>
              Overall calculated attendance rate is{" "}
              <strong className={Number(attendanceRate) >= 85 ? "text-success" : "text-warning"}>
                {attendanceRate}%
              </strong>{" "}
              {Number(attendanceRate) >= 85
                ? "(Meets university academic threshold of 85%)"
                : "(Below 85% attendance warning threshold)"}.
            </li>
            <li>
              Total recorded class sessions across all enrolled courses:{" "}
              <strong>{totalSessions}</strong>.
            </li>
            <li>
              Approved leave applications: <strong>{approvedLeaves}</strong> out of{" "}
              <strong>{leaveRequests.length}</strong> total requests.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
