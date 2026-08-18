import React from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { AttendanceCard } from "@/components/student/AttendanceCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { AttendanceRecord } from "@/types";
import { IoCalendarOutline } from "react-icons/io5";

export default async function StudentAttendancePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let attendanceLogs: AttendanceRecord[] = [];
  if (user) {
    const { data, error } = await supabase
      .from("attendance_records")
      .select(`
        *,
        course:courses!course_id (
          id,
          name,
          code
        )
      `)
      .eq("student_id", user.id)
      .order("date", { ascending: false });

    if (!error && data) {
      attendanceLogs = data;
    } else {
      const { data: simpleData } = await supabase
        .from("attendance_records")
        .select("*, courses(id, name, code)")
        .eq("student_id", user.id)
        .order("date", { ascending: false });

      attendanceLogs = (simpleData || []).map((r: any) => ({
        ...r,
        course: r.courses || null,
      }));
    }
  }

  // Calculate live stats
  const totalRecords = attendanceLogs.length;
  const presentCount = attendanceLogs.filter((r) => r.status === "present").length;
  const lateCount = attendanceLogs.filter((r) => r.status === "late").length;
  const absentCount = attendanceLogs.filter((r) => r.status === "absent").length;
  const excusedCount = attendanceLogs.filter((r) => r.status === "excused").length;

  const attendanceRate =
    totalRecords > 0
      ? (((presentCount + lateCount * 0.8 + excusedCount) / totalRecords) * 100).toFixed(1)
      : "100.0";

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="My Attendance History"
        text="View your daily class attendance logs, course breakdown, and presence percentage."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3.5 sm:p-6">
          <CardHeader className="p-0 pb-1 sm:pb-2">
            <CardTitle className="text-[11px] sm:text-xs text-muted-foreground font-medium">
              Overall Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xl sm:text-2xl font-bold text-success">
              {attendanceRate}%
            </div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1">
              Target: &gt; 85%
            </p>
          </CardContent>
        </Card>

        <Card className="p-3.5 sm:p-6">
          <CardHeader className="p-0 pb-1 sm:pb-2">
            <CardTitle className="text-[11px] sm:text-xs text-muted-foreground font-medium">
              Present Days
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {presentCount}
            </div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1">
              Of {totalRecords} total classes
            </p>
          </CardContent>
        </Card>

        <Card className="p-3.5 sm:p-6">
          <CardHeader className="p-0 pb-1 sm:pb-2">
            <CardTitle className="text-[11px] sm:text-xs text-muted-foreground font-medium">
              Late Days
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xl sm:text-2xl font-bold text-warning">
              {lateCount}
            </div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1">
              Logged tardiness
            </p>
          </CardContent>
        </Card>

        <Card className="p-3.5 sm:p-6">
          <CardHeader className="p-0 pb-1 sm:pb-2">
            <CardTitle className="text-[11px] sm:text-xs text-muted-foreground font-medium">
              Absences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xl sm:text-2xl font-bold text-destructive">
              {absentCount}
            </div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1">
              {excusedCount} excused
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
          Recorded Daily Logs ({attendanceLogs.length})
        </h2>

        {attendanceLogs.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground flex flex-col items-center">
            <IoCalendarOutline size={36} className="mb-2 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">No Attendance Records Logged</p>
            <p className="text-xs text-muted-foreground mt-1">
              Attendance marked by your course instructors will appear here automatically.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {attendanceLogs.map((log) => (
              <AttendanceCard
                key={log.id}
                date={formatDate(log.date)}
                status={log.status}
                remarks={
                  log.remarks
                    ? `${log.course?.name ? `[${log.course.code}] ` : ""}${log.remarks}`
                    : log.course?.name
                    ? `Course: ${log.course.name} (${log.course.code})`
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
