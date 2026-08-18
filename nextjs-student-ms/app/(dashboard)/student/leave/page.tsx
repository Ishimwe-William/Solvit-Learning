import React from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { createClient } from "@/lib/supabase/server";
import { StudentLeaveManager } from "@/components/student/StudentLeaveManager";
import { Course, LeaveRequest } from "@/types";

export default async function StudentLeavePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let enrolledCourses: Course[] = [];
  let pastRequests: LeaveRequest[] = [];

  if (user) {
    const [{ data: enrollments }, { data: requests, error: reqError }] = await Promise.all([
      supabase
        .from("course_enrollments")
        .select("courses:courses!course_id(*)")
        .eq("student_id", user.id),

      supabase
        .from("leave_requests")
        .select(`
          *,
          course:courses!course_id(name, code)
        `)
        .eq("student_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    if (enrollments && enrollments.length > 0) {
      enrolledCourses = enrollments.map((e: any) => e.courses).filter(Boolean);
    } else {
      // Fallback query if alias not used
      const { data: simpleEnrollments } = await supabase
        .from("course_enrollments")
        .select("courses(*)")
        .eq("student_id", user.id);
      enrolledCourses = (simpleEnrollments || []).map((e: any) => e.courses).filter(Boolean);
    }

    if (!reqError && requests) {
      pastRequests = requests;
    } else {
      const { data: simpleReqs } = await supabase
        .from("leave_requests")
        .select("*")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      pastRequests = (simpleReqs || []) as LeaveRequest[];
    }
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Leave & Absence Requests"
        text="Submit a new absence application or check the status of previous submissions."
      />

      <StudentLeaveManager
        enrolledCourses={enrolledCourses}
        initialRequests={pastRequests}
      />
    </div>
  );
}
