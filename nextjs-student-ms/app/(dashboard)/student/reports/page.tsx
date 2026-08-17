import React from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function StudentReportsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Attendance Reports & Statistics"
        text="Interactive breakdown and statistical overview of your attendance performance."
      >
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          📥 Download PDF Report
        </Button>
      </DashboardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <CardHeader className="mb-3 sm:mb-4">
            <CardTitle className="text-sm sm:text-base">Monthly Attendance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52 sm:h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center bg-muted/20">
              <span className="text-2xl sm:text-3xl mb-2">📊</span>
              <p className="text-xs sm:text-sm font-medium text-foreground">
                Monthly Breakdown Chart
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                Visualizing present days vs. absent/late days across current semester.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardHeader className="mb-3 sm:mb-4">
            <CardTitle className="text-sm sm:text-base">Leave Categories Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52 sm:h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center bg-muted/20">
              <span className="text-2xl sm:text-3xl mb-2">🍩</span>
              <p className="text-xs sm:text-sm font-medium text-foreground">
                Leave Request Pie / Donut Chart
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                Sick Leaves (60%) • Personal Leaves (30%) • Emergency (10%)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4 sm:p-6">
        <CardHeader className="mb-3 sm:mb-4">
          <CardTitle className="text-sm sm:text-base">Summary Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-xs sm:text-sm text-foreground list-disc list-inside">
            <li>Your overall attendance rate of <strong className="text-success">92.5%</strong> qualifies for semester honors distinction.</li>
            <li>No consecutive unexcused absences recorded in the last 60 days.</li>
            <li>All 3 submitted medical certificates have been reviewed and approved.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
