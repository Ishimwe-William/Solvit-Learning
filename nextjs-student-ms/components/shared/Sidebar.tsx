"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {FaCalendarCheck, FaRegChartBar, FaUserCheck, FaUsers} from "react-icons/fa";
import {MdSpaceDashboard} from "react-icons/md";
import {LuNotebookPen} from "react-icons/lu";
import {IoHourglass} from "react-icons/io5";
import {ImCheckboxChecked} from "react-icons/im";
import {logout} from "@/app/(auth)/actions";
import {FiLogOut} from "react-icons/fi";

interface SidebarProps {
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isOpenOnMobile = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const isStudentPortal = pathname.startsWith("/student");

  const teacherSections = [
    {
      title: "Overview",
      links: [
        { href: "/teacher/dashboard", label: "Dashboard", icon: <MdSpaceDashboard size={22} /> },
      ],
    },
    {
      title: "Attendance & Leaves",
      links: [
        { href: "/teacher/attendance", label: "Attendance Record", icon: <FaUserCheck size={20} /> },
        { href: "/teacher/leave-requests", label: "Leave Approvals", icon: <IoHourglass size={20} /> },
      ],
    },
    {
      title: "Management",
      links: [
        { href: "/teacher/students", label: "Member Directory", icon: <FaUsers size={20} /> },
        { href: "/teacher/approvals", label: "Account Approvals", icon: <ImCheckboxChecked size={20} /> },
      ],
    },
  ];

  const studentSections = [
    {
      title: "Overview",
      links: [
        { href: "/student/reports", label: "Reports & Stats", icon: <FaRegChartBar size={22} /> },
      ],
    },
    {
      title: "Attendance & Leaves",
      links: [
        { href: "/student/attendance", label: "My Attendance", icon: <FaCalendarCheck size={22} /> },
        { href: "/student/leave", label: "Request Leave", icon: <LuNotebookPen size={22} /> },
      ],
    },
  ];

  const navigationSections = isStudentPortal ? studentSections : teacherSections;

  const content = (
    <div className="flex flex-col justify-between h-full p-4">
      <div className="space-y-6">
        {/* Sidebar Brand Header */}
        <div className="flex items-center justify-between px-2 pb-2 border-b border-border">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Portal Workspace
            </span>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-muted-foreground hover:text-foreground p-1 text-sm"
              aria-label="Close menu"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="space-y-5">
          {navigationSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                {section.title}
              </div>
              <nav className="space-y-0.5">
                {section.links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onCloseMobile}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <span className="text-base">{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <form action={logout} className="border-t border-border pt-4">
        <button
          type={"submit"}
          onClick={onCloseMobile}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        >
          <FiLogOut size={22} />
          <span>Sign Out</span>
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-border bg-card/40 min-h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-over Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-card text-card-foreground border-r border-border shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
          isOpenOnMobile ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {content}
      </aside>
    </>
  );
}
