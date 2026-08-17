import React from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { LeaveRequestForm } from "@/components/student/LeaveRequestForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function StudentLeavePage() {
  const previousRequests = [
    {
      id: "1",
      type: "Sick Leave",
      dates: "Nov 02 - Nov 04, 2026",
      reason: "Flu symptoms under medical prescription",
      status: "approved" as const,
      remarks: "Approved. Medical certificate confirmed.",
    },
    {
      id: "2",
      type: "Personal Leave",
      dates: "Oct 12, 2026",
      reason: "Family event",
      status: "approved" as const,
      remarks: "Approved.",
    },
    {
      id: "3",
      type: "Emergency Absence",
      dates: "Aug 15, 2026",
      reason: "Travel delay",
      status: "rejected" as const,
      remarks: "Insufficient prior notification provided.",
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Leave & Absence Requests"
        text="Submit a new absence application or check the status of previous submissions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <Card className="p-4 sm:p-6">
          <CardHeader className="mb-3 sm:mb-4">
            <CardTitle className="text-base sm:text-lg">Submit Request</CardTitle>
          </CardHeader>
          <CardContent>
            <LeaveRequestForm />
          </CardContent>
        </Card>

        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Past Requests</h2>
          <div className="space-y-3">
            {previousRequests.map((req) => (
              <Card key={req.id} className="p-3.5 sm:p-4">
                <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
                  <span className="font-semibold text-xs sm:text-sm text-foreground">{req.type}</span>
                  <Badge variant={req.status === "approved" ? "success" : "destructive"}>
                    {req.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mb-1">📅 {req.dates}</p>
                <p className="text-xs sm:text-sm text-foreground mb-2">{req.reason}</p>
                {req.remarks && (
                  <div className="text-[11px] bg-muted/60 p-2 rounded text-muted-foreground">
                    <span className="font-medium text-foreground">Review note:</span> {req.remarks}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
