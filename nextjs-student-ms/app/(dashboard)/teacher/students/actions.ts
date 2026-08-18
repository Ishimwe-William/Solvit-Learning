"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/emails/actions";

interface AddMemberParams {
  fullName: string;
  email: string;
  password: string;
  role?: "student" | "teacher" | "admin";
}

export async function addMemberAction({
  fullName,
  email,
  password,
  role = "student",
}: AddMemberParams) {
  try {
    const supabaseAdmin = createAdminClient();

    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          role,
          status: "approved",
        },
      });

    if (authError) {
      return { success: false, error: authError.message };
    }

    const userId = authData.user?.id;

    if (userId) {
      // 2. Insert/Upsert into profiles table
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .upsert({
          id: userId,
          email,
          full_name: fullName,
          role,
          status: "approved",
        });

      if (profileError) {
        console.error("Error creating profile record:", profileError);
      }
    }

    // 3. Send email with generated credentials
    const { getAppUrl } = await import("@/lib/utils/host");
    const appUrl = await getAppUrl();
    await sendEmail({
      to: email,
      subject: "Welcome to Solvit Student Portal - Your Account Credentials",
      htmlData: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <h2 style="color: #2563eb; margin-bottom: 8px;">Welcome to Solvit Student Management System</h2>
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>An academic account has been created for you. Below are your secure login credentials:</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Email Address:</strong> <span style="font-family: monospace; color: #0f172a;">${email}</span></p>
            <p style="margin: 0 0 10px 0;"><strong>Temporary Password:</strong> <code style="background-color: #e2e8f0; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-family: monospace; color: #2563eb;">${password}</code></p>
            <p style="margin: 0;"><strong>Assigned Role:</strong> <span style="text-transform: capitalize;">${role}</span></p>
          </div>

          <p style="margin-bottom: 24px;">Please click the button below to log in and update your password:</p>
          <p>
            <a href="${appUrl}/login" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Log in to Portal
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
          <p style="color: #64748b; font-size: 12px;">If you have any questions or did not expect this registration, please contact your administration office.</p>
        </div>
      `,
      appName: "Solvit Student MS",
    });

    return {
      success: true,
      user: {
        id: userId,
        full_name: fullName,
        email,
        role,
        status: "approved",
        created_at: new Date().toISOString(),
      },
    };
  } catch (err: any) {
    console.error("Unexpected error in addMemberAction:", err);
    return { success: false, error: err.message || "Failed to create member" };
  }
}

interface UpdateMemberParams {
  id: string;
  fullName: string;
  role: "student" | "teacher" | "admin";
  status: "approved" | "pending" | "suspended";
}

export async function updateMemberAction({
  id,
  fullName,
  role,
  status,
}: UpdateMemberParams) {
  try {
    const supabaseAdmin = createAdminClient();

    const { data: updatedProfile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: fullName,
        role,
        status,
      })
      .eq("id", id)
      .select()
      .single();

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // Sync auth metadata
    try {
      await supabaseAdmin.auth.admin.updateUserById(id, {
        user_metadata: {
          full_name: fullName,
          role,
          status,
        },
      });
    } catch (metaErr) {
      console.warn("Could not sync auth user_metadata:", metaErr);
    }

    return { success: true, user: updatedProfile };
  } catch (err: any) {
    console.error("Unexpected error in updateMemberAction:", err);
    return { success: false, error: err.message || "Failed to update member" };
  }
}

