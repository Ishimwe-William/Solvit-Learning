"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/emails/actions";
import { revalidatePath } from "next/cache";
import { LeaveType } from "@/types";

interface SubmitLeaveParams {
  courseId?: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

export async function submitStudentLeaveAction({
  courseId,
  type,
  startDate,
  endDate,
  reason,
}: SubmitLeaveParams) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required to submit leave." };
    }

    const supabaseAdmin = createAdminClient();

    let request: any = null;
    let error: any = null;

    // 1. Try insert with course_id and relational join
    const primaryAttempt = await supabaseAdmin
      .from("leave_requests")
      .insert({
        student_id: user.id,
        course_id: courseId || null,
        type,
        start_date: startDate,
        end_date: endDate,
        reason: reason.trim(),
        status: "pending",
      })
      .select(`
        *,
        course:courses!course_id(name, code),
        student:profiles!student_id(full_name, email)
      `)
      .single();

    if (!primaryAttempt.error) {
      request = primaryAttempt.data;
    } else {
      // 2. If course_id column is missing or relationship fails, try without course_id
      const fallbackInsert = await supabaseAdmin
        .from("leave_requests")
        .insert({
          student_id: user.id,
          type,
          start_date: startDate,
          end_date: endDate,
          reason: reason.trim(),
          status: "pending",
        })
        .select(`*, student:profiles!student_id(full_name, email)`)
        .single();

      if (!fallbackInsert.error) {
        request = fallbackInsert.data;
      } else {
        // 3. Ultra fallback: simple select *
        const rawFallback = await supabaseAdmin
          .from("leave_requests")
          .insert({
            student_id: user.id,
            type,
            start_date: startDate,
            end_date: endDate,
            reason: reason.trim(),
            status: "pending",
          })
          .select("*")
          .single();

        if (rawFallback.error) {
          return { success: false, error: rawFallback.error.message };
        }
        request = rawFallback.data;
      }
    }

    revalidatePath("/student/leave");
    revalidatePath("/student/reports");
    revalidatePath("/teacher/leave-requests");
    revalidatePath("/teacher/dashboard");

    return { success: true, request };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit leave request" };
  }
}

interface ReviewLeaveParams {
  requestId: string;
  status: "approved" | "rejected";
  reviewRemarks?: string;
}

export async function reviewTeacherLeaveAction({
  requestId,
  status,
  reviewRemarks,
}: ReviewLeaveParams) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const supabaseAdmin = createAdminClient();

    let updated: any = null;
    let error: any = null;

    // Tier 1: Try full update with all metadata columns
    const fullAttempt = await supabaseAdmin
      .from("leave_requests")
      .update({
        status,
        reviewed_by: user?.id || null,
        reviewed_at: new Date().toISOString(),
        review_remarks: reviewRemarks || null,
      })
      .eq("id", requestId)
      .select(`
        *,
        student:profiles!student_id(full_name, email),
        course:courses!course_id(name, code)
      `)
      .single();

    if (!fullAttempt.error) {
      updated = fullAttempt.data;
    } else {
      // Tier 2: Try update with status and reviewed_by only
      const tier2Attempt = await supabaseAdmin
        .from("leave_requests")
        .update({
          status,
          reviewed_by: user?.id || null,
        })
        .eq("id", requestId)
        .select(`*, student:profiles!student_id(full_name, email)`)
        .single();

      if (!tier2Attempt.error) {
        updated = tier2Attempt.data;
      } else {
        // Tier 3: Minimum viable update (status only)
        const minimalAttempt = await supabaseAdmin
          .from("leave_requests")
          .update({ status })
          .eq("id", requestId)
          .select("*")
          .single();

        if (minimalAttempt.error) {
          return { success: false, error: minimalAttempt.error.message };
        }
        updated = minimalAttempt.data;
      }
    }

    // Try to get student email for notification if not already resolved
    let recipientEmail = updated?.student?.email;
    let studentName = updated?.student?.full_name || "Student";
    if (!recipientEmail && updated?.student_id) {
      const { data: studentProfile } = await supabaseAdmin
        .from("profiles")
        .select("email, full_name")
        .eq("id", updated.student_id)
        .single();
      recipientEmail = studentProfile?.email;
      studentName = studentProfile?.full_name || "Student";
    }

    // Send email notification to student
    if (recipientEmail) {
      const courseName = updated?.course?.name ? ` for ${updated.course.name}` : "";
      await sendEmail({
        to: recipientEmail,
        subject: `Leave Request ${status.toUpperCase()} - Solvit Portal`,
        htmlData: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <h2 style="color: #2563eb; margin-bottom: 8px;">Leave Request Update</h2>
            <p>Hello <strong>${studentName}</strong>,</p>
            <p>Your absence request${courseName} from <strong>${updated?.start_date || "requested dates"}</strong> to <strong>${updated?.end_date || ""}</strong> has been <strong>${status}</strong>.</p>
            
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin: 16px 0;">
              <p style="margin: 0 0 6px 0;"><strong>Category:</strong> <span style="text-transform: capitalize;">${updated?.type || "Absence"}</span></p>
              <p style="margin: 0 0 6px 0;"><strong>Status:</strong> <span style="font-weight: bold; text-transform: uppercase; color: ${status === 'approved' ? '#16a34a' : '#dc2626'}">${status}</span></p>
              ${reviewRemarks ? `<p style="margin: 0;"><strong>Admin Remarks:</strong> ${reviewRemarks}</p>` : ''}
            </div>

            <p style="color: #64748b; font-size: 12px; margin-top: 24px;">Solvit Academic Portal</p>
          </div>
        `,
        appName: "Solvit Student MS",
      });
    }

    revalidatePath("/teacher/leave-requests");
    revalidatePath("/teacher/dashboard");
    revalidatePath("/student/leave");
    revalidatePath("/student/reports");

    return { success: true, request: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update leave request" };
  }
}
