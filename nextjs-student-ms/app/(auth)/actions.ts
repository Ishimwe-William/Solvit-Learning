"use server"

import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import {headers} from "next/headers";

export async function loginWithEmail(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const {data: authData, error} = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)

    if (authData?.user) {
        const {data: profile} = await supabase
            .from("profiles")
            .select("role, status")
            .eq("id", authData.user.id)
            .single()

        if (profile?.status === "pending") {
            redirect("/pending-approval")
        }

        if (profile?.status === "suspended" || profile?.status === "rejected") {
            redirect("/suspended")
        }

        if (profile?.role === 'teacher' || profile?.role === 'admin') {
            redirect('/teacher/dashboard')
        } else {
            redirect('/student/attendance')
        }
    }

    redirect('/student/attendance')
}

export async function studentRegister(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    const initialRole = "student";
    const initialStatus = "pending";

    const {data, error} = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: initialRole,
                status: initialStatus
            }
        }
    })

    if (error) redirect(`/register?error=${encodeURIComponent(error.message)}`)

    if (data?.user) {
        await supabase.from("profiles").insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            role: initialRole,
            status: initialStatus
        })
    }
    redirect("/pending-approval");
}

export async function loginWithGoogle() {
    const supabase = await createClient();
    const origin = (await headers()).get("origin")

    const {data, error} = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/api/auth/callback`
        }
    })

    if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)

    if (data.url) {
        redirect(data.url)
    }
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

export async function requestPasswordReset(formData: FormData) {
    const email = formData.get("email") as string;
    if (!email) {
        return { success: false, error: "Please enter a valid email address." };
    }

    try {
        const { getAppUrl } = await import("@/lib/utils/host");
        const origin = await getAppUrl();

        const { createAdminClient } = await import("@/lib/supabase/admin");
        const { sendEmail } = await import("@/lib/emails/actions");
        const supabaseAdmin = createAdminClient();

        // 1. Generate Supabase Auth recovery link
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: "recovery",
            email: email.trim().toLowerCase(),
            options: {
                redirectTo: `${origin}/api/auth/callback?next=/reset-password`,
            },
        });

        if (error) {
            return { success: false, error: error.message };
        }

        const resetLink = data?.properties?.action_link;

        if (resetLink) {
            // 2. Dispatch custom reset email via direct SMTP
            await sendEmail({
                to: email.trim().toLowerCase(),
                subject: "Reset Your Password - Solvit Student Portal",
                htmlData: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
                        <h2 style="color: #2563eb; margin-bottom: 8px;">Password Reset Request</h2>
                        <p>Hello,</p>
                        <p>We received a request to reset your password for the Solvit portal. Click the button below to choose a new password:</p>
                        
                        <p style="margin: 24px 0;">
                            <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                Reset My Password
                            </a>
                        </p>
                        
                        <p style="color: #64748b; font-size: 13px;">Or copy and paste this link in your browser:</p>
                        <p style="background: #f1f5f9; padding: 10px; border-radius: 6px; font-size: 11px; word-break: break-all; color: #334155;">
                            ${resetLink}
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
                        <p style="color: #94a3b8; font-size: 12px;">If you did not request this, please ignore this email. Your password will remain unchanged.</p>
                    </div>
                `,
                appName: "Solvit Student MS",
            });
        }

        return {
            success: true,
            message: "Password reset link has been dispatched to your email.",
        };
    } catch (err: any) {
        return {
            success: false,
            error: err.message || "Failed to send reset link. Please try again.",
        };
    }
}

export async function updateUserPassword(formData: FormData) {
    const password = formData.get("password") as string;
    if (!password || password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters long." };
    }

    try {
        const supabase = await createClient();
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to update password." };
    }
}

