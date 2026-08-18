import React from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import { TeacherLeaveApprovalsTable } from "@/components/teacher/TeacherLeaveApprovalsTable";
import { LeaveRequest } from "@/types";

export default async function LeaveRequestsPage() {
  const supabase = await createClient();

  const { data: requestsData, error } = await supabase
    .from("leave_requests")
    .select(`
      *,
      student:profiles!student_id (
        id,
        full_name,
        email,
        role,
        status,
        created_at
      ),
      course:courses!course_id (
        id,
        name,
        code
      )
    `)
    .order("created_at", { ascending: false });

  // Fallback if joined tables or course_id column are not present
  let requests: LeaveRequest[] = [];
  if (!error && requestsData) {
    requests = requestsData;
  } else {
    // If course_id doesn't exist, query profiles join only
    const { data: simpleData } = await supabase
      .from("leave_requests")
      .select(`
        *,
        student:profiles!student_id (
          id,
          full_name,
          email,
          role,
          status,
          created_at
        )
      `)
      .order("created_at", { ascending: false });

    if (simpleData) {
      requests = simpleData as LeaveRequest[];
    } else {
      // Ultra raw fallback
      const { data: rawData } = await supabase
        .from("leave_requests")
        .select("*")
        .order("created_at", { ascending: false });
      requests = (rawData || []) as LeaveRequest[];
    }
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Leave & Absence Approvals"
        text="Review, approve, or reject submitted absence applications across all courses."
      />

      <Card className="p-4 sm:p-6">
        <CardHeader className="mb-3 sm:mb-4">
          <CardTitle className="text-base sm:text-lg">
            Submitted Absence Requests ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TeacherLeaveApprovalsTable initialRequests={requests} />
        </CardContent>
      </Card>
    </div>
  );
}
