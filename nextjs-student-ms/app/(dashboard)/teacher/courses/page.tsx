import React from "react";
import { createClient } from "@/lib/supabase/server";
import { CoursesList } from "@/components/teacher/CoursesList";

export default async function TeacherCoursesPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("*, course_enrollments(count)")
    .order("created_at", { ascending: false });

  const formattedCourses = (courses || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    code: c.code,
    description: c.description,
    teacher_id: c.teacher_id,
    created_at: c.created_at,
    enrollments_count: c.course_enrollments?.[0]?.count || 0,
  }));

  return (
    <div className="space-y-6">
      <CoursesList initialCourses={formattedCourses} />
    </div>
  );
}
