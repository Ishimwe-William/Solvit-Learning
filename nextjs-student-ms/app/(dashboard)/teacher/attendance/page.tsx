import React from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { AttendanceTable } from "@/components/teacher/AttendanceTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Attendance Recording"
        text="Mark, adjust, and record attendance for members."
      />

      <Card className="p-4 sm:p-6">
        <CardHeader className="mb-3 sm:mb-4">
          <CardTitle className="text-base sm:text-lg">Daily Attendance Roster</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceTable />
        </CardContent>
      </Card>
    </div>
  );
}
