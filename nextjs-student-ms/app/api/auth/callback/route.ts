import {createClient} from "@/lib/supabase/server";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
    const {searchParams, origin} = new URL(request.url)
    const code = searchParams.get("code");
    const next = searchParams.get("next");

    if (code) {
        const supabase = await createClient();
        const {data, error} = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data?.user) {
            // If explicit destination was requested (e.g. password recovery)
            if (next) {
                return NextResponse.redirect(`${origin}${next}`);
            }

            const {data: profile} = await supabase
                .from("profiles")
                .select("role, status")
                .eq("id", data.user.id)
                .single()

            if (!profile) {
                await supabase.from("profiles").insert({
                    id: data.user.id,
                    email: data.user.email!,
                    full_name: data.user.user_metadata.full_name || 'Google User',
                    role: 'student',
                    status: 'pending',
                })

                return NextResponse.redirect(`${origin}/pending-approval`)
            }

            if (profile.status === 'pending') {
                return NextResponse.redirect(`${origin}/pending-approval`)
            }

            if (profile.role === 'teacher' || profile.role === 'admin') {
                return NextResponse.redirect(`${origin}/teacher/dashboard`)
            }
            return NextResponse.redirect(`${origin}/student/attendance`)
        }
    }

    return NextResponse.redirect(`${origin}/login?error=OAuth auth extraction failed`)
}