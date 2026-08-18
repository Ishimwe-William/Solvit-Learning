"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CreateCourseParams {
  name: string;
  code: string;
  description?: string;
}

export async function createCourseAction({
  name,
  code,
  description,
}: CreateCourseParams) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const supabaseAdmin = createAdminClient();

    const { data: course, error } = await supabaseAdmin
      .from("courses")
      .insert({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description?.trim() || null,
        teacher_id: user?.id || null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/teacher/courses");
    revalidatePath("/teacher/attendance");
    return { success: true, course };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create course" };
  }
}

interface EnrollStudentParams {
  courseId: string;
  studentId: string;
}

export async function enrollStudentAction({
  courseId,
  studentId,
}: EnrollStudentParams) {
  try {
    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
      .from("course_enrollments")
      .insert({
        course_id: courseId,
        student_id: studentId,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/teacher/courses/${courseId}`);
    revalidatePath("/teacher/attendance");
    return { success: true, enrollment: data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to enroll student" };
  }
}

export async function removeStudentEnrollmentAction({
  courseId,
  studentId,
}: EnrollStudentParams) {
  try {
    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin
      .from("course_enrollments")
      .delete()
      .match({ course_id: courseId, student_id: studentId });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/teacher/courses/${courseId}`);
    revalidatePath("/teacher/attendance");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to remove enrollment" };
  }
}
