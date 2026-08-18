"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface AttendanceEntry {
  studentId: string;
  status: "present" | "absent" | "late" | "excused";
  remarks?: string;
}

interface SaveAttendanceParams {
  courseId: string;
  date: string;
  records: AttendanceEntry[];
}

export async function saveCourseAttendanceAction({
  courseId,
  date,
  records,
}: SaveAttendanceParams) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const supabaseAdmin = createAdminClient();

    const upsertPayload = records.map((r) => ({
      course_id: courseId,
      student_id: r.studentId,
      date,
      status: r.status,
      remarks: r.remarks || null,
      marked_by: user?.id || null,
    }));

    const { data, error } = await supabaseAdmin
      .from("attendance_records")
      .upsert(upsertPayload, {
        onConflict: "course_id,student_id,date",
      })
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/teacher/attendance");
    revalidatePath("/student/attendance");
    revalidatePath("/student/reports");
    revalidatePath("/teacher/dashboard");
    return { success: true, count: data?.length || 0 };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save attendance" };
  }
}
