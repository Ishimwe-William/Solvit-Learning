import React from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CourseDetailManager } from "@/components/teacher/CourseDetailManager";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Parallelize course, enrollments, and available students queries
  const [
    { data: course, error: courseError },
    { data: enrollments },
    { data: allStudents },
  ] = await Promise.all([
    supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single(),

    supabase
      .from("course_enrollments")
      .select(`
        enrolled_at,
        profiles:profiles!student_id (
          id,
          full_name,
          email,
          role,
          status,
          created_at
        )
      `)
      .eq("course_id", id),

    supabase
      .from("profiles")
      .select("id, full_name, email, role, status, created_at")
      .eq("role", "student")
      .eq("status", "approved")
      .order("full_name", { ascending: true }),
  ]);

  if (courseError || !course) {
    notFound();
  }

  const enrolledStudents = (enrollments || [])
    .filter((e: any) => e.profiles)
    .map((e: any) => ({
      id: e.profiles.id,
      full_name: e.profiles.full_name,
      email: e.profiles.email,
      role: e.profiles.role,
      status: e.profiles.status,
      created_at: e.profiles.created_at,
      enrolled_at: e.enrolled_at,
    }));

  return (
    <div className="space-y-6">
      <CourseDetailManager
        course={course}
        enrolledStudents={enrolledStudents}
        availableStudents={allStudents || []}
      />
    </div>
  );
}
