"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/(auth)/actions";
import { type User } from "@supabase/supabase-js";

interface NavbarProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
  initialUser?: User | null;
}

export function Navbar({ onToggleMobileMenu, isMobileMenuOpen, initialUser = null }: NavbarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoggingOut, startLogoutTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();

    // Fetch live user if not already provided
    supabase.auth.getUser().then(({ data: { user: liveUser } }) => {
      setUser(liveUser);
      setLoading(false);
    });

    // Listen for auth state transitions (login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const role = user?.user_metadata?.role || (pathname.startsWith("/teacher") ? "teacher" : "student");
  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  // Role-specific navigation tabs
  const teacherLinks = [
    { href: "/teacher/dashboard", label: "Dashboard" },
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

  const mainLinks = !user
    ? publicLinks
    : role === "teacher" || role === "admin"
    ? teacherLinks
    : studentLinks;

  const handleSignOut = () => {
    startLogoutTransition(async () => {
      await logout();
    });
  };

  const homeUrl = user
    ? role === "teacher" || role === "admin"
      ? "/teacher/dashboard"
      : "/student/attendance"
    : "/";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Hamburger */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              aria-label="Toggle Navigation Menu"
              className="inline-flex md:hidden items-center justify-center p-2 rounded-lg text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
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
          {!loading && user ? (
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
          ) : !loading ? (
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
          ) : (
            <div className="w-24 h-8 rounded-md bg-muted/40 animate-pulse" />
          )}
        </div>

        {/* Mobile View Menu Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-lg text-foreground hover:bg-muted focus:outline-none"
            aria-label="Toggle Quick Links"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileNavOpen && (
        <div className="sm:hidden border-t border-border bg-card px-4 py-3 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className="text-center text-xs font-medium py-2 rounded-md bg-muted text-foreground hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            {user ? (
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold uppercase">
                    {fullName.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-foreground">{fullName} ({role})</span>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="text-xs font-semibold text-destructive px-2.5 py-1 rounded bg-destructive/10 cursor-pointer"
                >
                  {isLoggingOut ? "..." : "Sign Out"}
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileNavOpen(false)}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
