import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface AttendanceCardProps {
  date: string;
  status: "present" | "absent" | "late" | "excused";
  remarks?: string;
}

export function AttendanceCard({ date, status, remarks }: AttendanceCardProps) {
  const badgeVariants = {
    present: "success" as const,
    absent: "destructive" as const,
    late: "warning" as const,
    excused: "info" as const,
  };

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{date}</CardTitle>
        <Badge variant={badgeVariants[status]}>
          {status.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          {remarks || "No additional remarks recorded."}
        </p>
      </CardContent>
    </Card>
  );
}
