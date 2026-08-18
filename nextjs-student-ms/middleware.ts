import {type NextRequest, NextResponse} from 'next/server'
import {createServerClient} from "@supabase/ssr";

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({request})

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({name, value}) => request.cookies.set(name, value))

                    supabaseResponse = NextResponse.next({request})
                    cookiesToSet.forEach(({name, value, options}) => {
                        supabaseResponse.cookies.set(name, value, options)
                    })
                }
            }
        }
    )

    const {data: {user}} = await supabase.auth.getUser();
    const {pathname} = request.nextUrl;

    const isForgotPasswordPage = pathname.startsWith("/forgot-password");
    const isResetPasswordPage = pathname.startsWith("/reset-password");

    const isAuthPage =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        isForgotPasswordPage ||
        isResetPasswordPage;

    const isPendingApprovalPage = pathname === "/pending-approval";
    const isSuspendedPage = pathname === "/suspended";
    const isApiRoute = pathname.startsWith("/api");
    const isLandingPage = pathname === "/";

    if (!user) {
        if (!isAuthPage && !isApiRoute && !isLandingPage && !isPendingApprovalPage && !isSuspendedPage) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return supabaseResponse;
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("id", user.id)
        .single();

    const role = profile?.role || user.user_metadata?.role;
    const status = profile?.status || user.user_metadata?.status;

    if (isResetPasswordPage) {
        return supabaseResponse;
    }

    if (status === "pending") {
        if (isPendingApprovalPage || isLandingPage) {
            return supabaseResponse;
        }
        return NextResponse.redirect(new URL("/pending-approval", request.url));
    }

    if (status === "suspended" || status === "rejected") {
        if (isSuspendedPage || isLandingPage) {
            return supabaseResponse;
        }
        return NextResponse.redirect(new URL("/suspended", request.url));
    }

    if ((isPendingApprovalPage || isSuspendedPage) && status === "approved") {
        const defaultHome =
            role === "teacher" || role === "admin"
                ? "/teacher/dashboard"
                : "/student/attendance";

        return NextResponse.redirect(new URL(defaultHome, request.url));
    }

    if ((pathname.startsWith("/login") || pathname.startsWith("/register") || isForgotPasswordPage) && status === "approved") {
        const defaultHome =
            role === "teacher" || role === "admin"
                ? "/teacher/dashboard"
                : "/student/attendance";

        return NextResponse.redirect(new URL(defaultHome, request.url));
    }

    if (pathname.startsWith("/student") && role !== "student") {
        return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
    }

    if (pathname.startsWith("/teacher") && role !== "teacher" && role !== "admin") {
        return NextResponse.redirect(new URL("/student/attendance", request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}