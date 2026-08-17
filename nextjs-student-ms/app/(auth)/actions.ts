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
    redirect("/login")
}
