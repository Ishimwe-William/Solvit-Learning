import React from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const mockRequests = [
  {
    id: "1",
    member: "Alex Rivera",
    email: "alex@example.com",
    type: "Sick Leave",
    dates: "Nov 02 - Nov 04",
    reason: "Flu recovery under doctor prescription",
    status: "pending" as const,
  },
  {
    id: "2",
    member: "Sarah Connor",
    email: "sarah@example.com",
    type: "Personal Leave",
    dates: "Nov 06",
    reason: "Attending certified regional competition",
    status: "pending" as const,
  },
  {
    id: "3",
    member: "Michael Scott",
    email: "michael@example.com",
    type: "Emergency Absence",
    dates: "Oct 28",
    reason: "Urgent family matter",
    status: "approved" as const,
  },
];

export default function LeaveRequestsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Leave & Absence Approvals"
        text="Review, approve, or reject submitted absence applications."
      />

      <Card className="p-4 sm:p-6">
        <CardHeader className="mb-3 sm:mb-4">
          <CardTitle className="text-base sm:text-lg">Pending & Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead className="hidden md:table-cell">Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Decision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{req.member}</div>
                    <div className="text-[11px] text-muted-foreground">{req.email}</div>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm text-foreground whitespace-nowrap">{req.type}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{req.dates}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate text-xs text-foreground">{req.reason}</TableCell>
                  <TableCell>
                    <Badge variant={req.status === "approved" ? "success" : "warning"}>
                      {req.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {req.status === "pending" ? (
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Button size="sm" variant="primary" className="px-2 py-1 text-xs">
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" className="px-2 py-1 text-xs">
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Resolved</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
