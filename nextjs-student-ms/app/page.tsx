import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import {PiChalkboardTeacherDuotone, PiStudentDuotone} from "react-icons/pi";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-16 text-center max-w-4xl mx-auto w-full">
         <div className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
          Student Management System
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Unified Academic Attendance & Leave Management
        </h1>
        <p className="mt-3 sm:mt-4 max-w-2xl text-xs sm:text-base text-muted-foreground px-2">
          Streamline daily attendance records, leave/sick day approvals, analytical reports with interactive charts, and student approvals.
        </p>

        <div className="mt-6 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl text-left">
          <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-2">
              <PiStudentDuotone size={42}/>
              <h2 className="text-base sm:text-lg font-bold text-foreground">Student Portal</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Track attendance percentage, apply for leave or sick days, and view performance charts.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/student/attendance" className="text-xs sm:text-sm text-primary hover:underline font-medium">
                → Attendance History
              </Link>
              <Link href="/student/leave" className="text-xs sm:text-sm text-primary hover:underline font-medium">
                → Ask Leave / Sick Day
              </Link>
              <Link href="/student/reports" className="text-xs sm:text-sm text-primary hover:underline font-medium">
                → Reports & Statistics
              </Link>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-2">
              <PiChalkboardTeacherDuotone size={42} />
              <h2 className="text-base sm:text-lg font-bold text-foreground">Teacher / Admin Portal</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Record daily attendance, review leave requests, add students with random passwords, and approve accounts.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/teacher/dashboard" className="text-xs sm:text-sm text-primary hover:underline font-medium">
                → Analytics Dashboard
              </Link>
              <Link href="/teacher/attendance" className="text-xs sm:text-sm text-primary hover:underline font-medium">
                → Record Attendance
              </Link>
              <Link href="/teacher/leave-requests" className="text-xs sm:text-sm text-primary hover:underline font-medium">
                → Leave Approvals
              </Link>
              <Link href="/teacher/students" className="text-xs sm:text-sm text-primary hover:underline font-medium">
                → Add & Manage Students
              </Link>
              <Link href="/teacher/approvals" className="text-xs sm:text-sm text-primary hover:underline font-medium">
                → Student Approvals
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
