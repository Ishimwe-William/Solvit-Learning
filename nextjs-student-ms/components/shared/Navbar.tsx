"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/(auth)/actions";
import { type User } from "@supabase/supabase-js";
import { IoMenuOutline, IoCloseOutline, IoEllipsisVerticalOutline } from "react-icons/io5";

interface NavbarProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
  initialUser?: User | null;
}

export function Navbar({ onToggleMobileMenu, isMobileMenuOpen, initialUser = null }: NavbarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(initialUser);
  const [userStatus, setUserStatus] = useState<string | null>(
    (initialUser?.user_metadata?.status as string) || null
  );
  const [userRole, setUserRole] = useState<string | null>(
    (initialUser?.user_metadata?.role as string) || null
  );
  const [userFullName, setUserFullName] = useState<string | null>(
    (initialUser?.user_metadata?.full_name as string) || null
  );
  const [loading, setLoading] = useState(!initialUser);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoggingOut, startLogoutTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();

    const fetchUserProfile = async (currentUser: User | null) => {
      if (!currentUser) {
        setUser(null);
        setUserStatus(null);
        setUserRole(null);
        setUserFullName(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // Always query the profiles table as the single source of truth for dynamic status & role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, status, full_name")
        .eq("id", currentUser.id)
        .single();

      const status = profile?.status || (currentUser.user_metadata?.status as string) || "pending";
      const role = profile?.role || (currentUser.user_metadata?.role as string) || "student";
      const fullName =
        profile?.full_name ||
        (currentUser.user_metadata?.full_name as string) ||
        currentUser.email?.split("@")[0] ||
        "User";

      setUserStatus(status);
      setUserRole(role);
      setUserFullName(fullName);
      setLoading(false);
    };

    // Fetch live user and profile
    supabase.auth.getUser().then(({ data: { user: liveUser } }) => {
      fetchUserProfile(liveUser);
    });

    // Listen for auth transitions
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUserProfile(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isPending = userStatus === "pending";
  const isSuspended = userStatus === "suspended" || userStatus === "rejected";
  const isApproved = !!user && userStatus === "approved";

  const role =
    userRole ||
    (pathname.startsWith("/teacher") ? "teacher" : "student");

  const fullName =
    userFullName ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  // Role-specific navigation tabs
  const teacherLinks = [
    { href: "/teacher/dashboard", label: "Dashboard" },
    { href: "/teacher/courses", label: "Courses" },
    { href: "/teacher/attendance", label: "Record Attendance" },
    { href: "/teacher/leave-requests", label: "Leave Approvals" },
    { href: "/teacher/students", label: "Members" },
    { href: "/teacher/approvals", label: "Approvals" },
  ];

  const studentLinks = [
    { href: "/student/attendance", label: "My Attendance" },
    { href: "/student/leave", label: "Request Leave" },
    { href: "/student/reports", label: "Reports & Stats" },
  ];

  const publicLinks = [
    { href: "/teacher/dashboard", label: "Teacher Portal" },
    { href: "/student/attendance", label: "Student Portal" },
  ];

  // Only show internal portal links to approved users
  const mainLinks = !isApproved
    ? publicLinks
    : role === "teacher" || role === "admin"
    ? teacherLinks
    : studentLinks;

  const handleSignOut = () => {
    startLogoutTransition(async () => {
      await logout();
    });
  };

  const homeUrl = isApproved
    ? role === "teacher" || role === "admin"
      ? "/teacher/dashboard"
      : "/student/attendance"
    : isPending
    ? "/pending-approval"
    : isSuspended
    ? "/suspended"
    : "/";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Hamburger (Dashboard only) */}
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              aria-label="Toggle Navigation Menu"
              className="inline-flex md:hidden items-center justify-center p-2 min-h-[44px] min-w-[44px] rounded-lg text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer touch-manipulation active:bg-muted"
            >
              {isMobileMenuOpen ? (
                <IoCloseOutline size={26} />
              ) : (
                <IoMenuOutline size={26} />
              )}
            </button>
          )}

          <Link href={homeUrl} className="flex items-center gap-2.5">
            <Image
              src="/Primary-Horizontal.svg"
              alt="Logo"
              width={140}
              height={36}
              className="h-8 sm:h-9 w-auto object-contain"
              priority
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1.5">
          {mainLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs md:text-sm font-medium px-3 py-1.5 rounded-lg transition-colors",
                  isActive
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth CTA / User Profile Header Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-8 rounded-md bg-muted/40 animate-pulse" />
          ) : isApproved ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-muted/60 border border-border">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold uppercase">
                  {fullName.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-medium text-foreground leading-tight max-w-[120px] truncate">
                    {fullName}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                    {role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                disabled={isLoggingOut}
                className="text-xs font-medium text-destructive hover:bg-destructive/10 border border-destructive/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          ) : isPending ? (
            <div className="flex items-center gap-2">
              <Link
                href="/pending-approval"
                className="text-xs font-medium text-warning bg-warning/10 border border-warning/25 hover:bg-warning/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                Pending Review
              </Link>
              <button
                onClick={handleSignOut}
                disabled={isLoggingOut}
                className="text-xs font-medium text-destructive hover:bg-destructive/10 border border-destructive/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? "..." : "Sign Out"}
              </button>
            </div>
          ) : isSuspended ? (
            <div className="flex items-center gap-2">
              <Link
                href="/suspended"
                className="text-xs font-medium text-destructive bg-destructive/10 border border-destructive/25 hover:bg-destructive/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                Account Suspended
              </Link>
              <button
                onClick={handleSignOut}
                disabled={isLoggingOut}
                className="text-xs font-medium text-destructive hover:bg-destructive/10 border border-destructive/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? "..." : "Sign Out"}
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-3.5 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile View Menu Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-foreground hover:bg-muted focus:outline-none cursor-pointer touch-manipulation active:bg-muted"
            aria-label="Toggle Quick Links"
          >
            <IoEllipsisVerticalOutline size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileNavOpen && (
        <div className="sm:hidden border-t border-border bg-card px-4 py-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className="text-center text-xs font-semibold py-2.5 px-2 min-h-[40px] flex items-center justify-center rounded-lg bg-muted text-foreground hover:bg-accent touch-manipulation active:scale-[0.98] transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            {isApproved ? (
              <div className="w-full flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold uppercase">
                    {fullName.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-foreground truncate max-w-[140px]">
                    {fullName} ({role})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="text-xs font-semibold text-destructive px-3 py-2 min-h-[36px] rounded-lg bg-destructive/10 hover:bg-destructive/20 cursor-pointer touch-manipulation active:scale-[0.98] transition-all"
                >
                  {isLoggingOut ? "..." : "Sign Out"}
                </button>
              </div>
            ) : isPending ? (
              <div className="w-full flex items-center justify-between gap-2">
                <Link
                  href="/pending-approval"
                  onClick={() => setMobileNavOpen(false)}
                  className="text-xs font-medium text-warning bg-warning/10 border border-warning/20 px-3 py-2 rounded-lg"
                >
                  Pending Review
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="text-xs font-semibold text-destructive px-3 py-2 min-h-[36px] rounded-lg bg-destructive/10 hover:bg-destructive/20 cursor-pointer touch-manipulation active:scale-[0.98] transition-all"
                >
                  {isLoggingOut ? "..." : "Sign Out"}
                </button>
              </div>
            ) : isSuspended ? (
              <div className="w-full flex items-center justify-between gap-2">
                <Link
                  href="/suspended"
                  onClick={() => setMobileNavOpen(false)}
                  className="text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-lg"
                >
                  Account Suspended
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="text-xs font-semibold text-destructive px-3 py-2 min-h-[36px] rounded-lg bg-destructive/10 hover:bg-destructive/20 cursor-pointer touch-manipulation active:scale-[0.98] transition-all"
                >
                  {isLoggingOut ? "..." : "Sign Out"}
                </button>
              </div>
            ) : (
              <div className="w-full flex items-center justify-end gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileNavOpen(false)}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground touch-manipulation"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
