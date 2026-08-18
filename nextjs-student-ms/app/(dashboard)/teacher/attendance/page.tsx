import React, { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { CourseAttendanceRecorder } from "@/components/teacher/CourseAttendanceRecorder";
import { Course, UserProfile, AttendanceStatus } from "@/types";

export default async function AttendancePage() {
  const supabase = await createClient();

  // Parallelize queries
  const [
    { data: coursesData },
    { data: enrollmentsData },
    { data: attendanceData },
  ] = await Promise.all([
    supabase
      .from("courses")
      .select("*")
      .order("name", { ascending: true }),

    supabase
      .from("course_enrollments")
      .select(`
        course_id,
        profiles:profiles!student_id (
          id,
          full_name,
          email,
          role,
          status,
          created_at
        )
      `),

    supabase
      .from("attendance_records")
      .select("course_id, student_id, date, status, remarks"),
  ]);

  const courses: Course[] = coursesData || [];

  const enrolledStudentsMap: Record<string, UserProfile[]> = {};
  (enrollmentsData || []).forEach((e: any) => {
    if (e.profiles && e.profiles.status === "approved") {
      if (!enrolledStudentsMap[e.course_id]) {
        enrolledStudentsMap[e.course_id] = [];
      }
      enrolledStudentsMap[e.course_id].push({
        id: e.profiles.id,
        full_name: e.profiles.full_name,
        email: e.profiles.email,
        role: e.profiles.role,
        status: e.profiles.status,
        created_at: e.profiles.created_at,
      });
    }
  });

  const existingAttendanceMap: Record<
    string,
    Record<string, { status: AttendanceStatus; remarks?: string }>
  > = {};

  (attendanceData || []).forEach((rec: any) => {
    const key = `${rec.course_id}_${rec.date}`;
    if (!existingAttendanceMap[key]) {
      existingAttendanceMap[key] = {};
    }
    existingAttendanceMap[key][rec.student_id] = {
      status: rec.status as AttendanceStatus,
      remarks: rec.remarks,
    };
  });

  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground animate-pulse">Loading Attendance Roster...</div>}>
        <CourseAttendanceRecorder
          courses={courses}
          enrolledStudentsMap={enrolledStudentsMap}
          existingAttendanceMap={existingAttendanceMap}
        />
      </Suspense>
    </div>
  );
}
