import React from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Analytics Dashboard"
        text="Real-time attendance metrics, absence requests, and membership overview."
      >
        <Link href="/teacher/attendance" className="w-full sm:w-auto">
          <Button variant="primary" size="sm" className="w-full sm:w-auto">
            Take Attendance
          </Button>
        </Link>
      </DashboardHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3.5 sm:p-6">
          <CardHeader className="p-0 pb-1 sm:pb-2">
            <CardTitle className="text-[11px] sm:text-xs text-muted-foreground font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xl sm:text-2xl font-bold text-foreground">128</div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1">Across 4 groups</p>
          </CardContent>
        </Card>

        <Card className="p-3.5 sm:p-6">
          <CardHeader className="p-0 pb-1 sm:pb-2">
            <CardTitle className="text-[11px] sm:text-xs text-muted-foreground font-medium">Today&apos;s Attendance</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xl sm:text-2xl font-bold text-success">94.2%</div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1">120 Present / 8 Absent</p>
          </CardContent>
        </Card>

        <Card className="p-3.5 sm:p-6">
          <CardHeader className="p-0 pb-1 sm:pb-2">
            <CardTitle className="text-[11px] sm:text-xs text-muted-foreground font-medium">Pending Leaves</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xl sm:text-2xl font-bold text-warning">5</div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1">Needs review</p>
          </CardContent>
        </Card>

        <Card className="p-3.5 sm:p-6">
          <CardHeader className="p-0 pb-1 sm:pb-2">
            <CardTitle className="text-[11px] sm:text-xs text-muted-foreground font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xl sm:text-2xl font-bold text-info">3</div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1">New accounts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <CardHeader className="mb-3 sm:mb-4">
            <CardTitle className="text-sm sm:text-base">Weekly Attendance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52 sm:h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center bg-muted/20">
              <span className="text-2xl sm:text-3xl mb-2">📈</span>
              <p className="text-xs sm:text-sm font-medium text-foreground">
                Attendance Line / Bar Chart
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                Mon (95%) • Tue (92%) • Wed (96%) • Thu (94%) • Fri (91%)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardHeader className="mb-3 sm:mb-4">
            <CardTitle className="text-sm sm:text-base">Absence Breakdown by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52 sm:h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center bg-muted/20">
              <span className="text-2xl sm:text-3xl mb-2">📊</span>
              <p className="text-xs sm:text-sm font-medium text-foreground">
                Categorical Absence Chart
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                Medical (55%) • Transportation (25%) • Personal (20%)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
