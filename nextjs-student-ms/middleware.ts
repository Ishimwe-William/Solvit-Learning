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

    const isAuthPage =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register");

    const isPendingApprovalPage = pathname === "/pending-approval";
    const isApiRoute = pathname.startsWith("/api");
    const isLandingPage = pathname === "/";

    if (!user) {
        if (!isAuthPage && !isApiRoute && !isLandingPage && !isPendingApprovalPage) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return supabaseResponse;
    }

    let role = user.user_metadata?.role as string | undefined;
    let status = user.user_metadata?.status as string | undefined;

    if (!role || !status) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role, status")
            .eq("id", user.id)
            .single();

        role = role || profile?.role;
        status = status || profile?.status;
    }

    if (!role || !status) {
        if (isAuthPage || isApiRoute || isPendingApprovalPage) return supabaseResponse;
        return NextResponse.redirect(new URL("/pending-approval", request.url));
    }

    if (status === "pending") {
        if (isPendingApprovalPage) {
            return supabaseResponse;
        }
        return NextResponse.redirect(new URL("/pending-approval", request.url));
    }

    const defaultHome =
        role === "teacher" || role === "admin"
            ? "/teacher/dashboard"
            : "/student/attendance";

    if (isAuthPage || isPendingApprovalPage) {
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