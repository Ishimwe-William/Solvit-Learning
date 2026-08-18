"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { formatDate } from "@/lib/utils";
import {
  enrollStudentAction,
  removeStudentEnrollmentAction,
} from "@/app/(dashboard)/teacher/courses/actions";
import { Course, UserProfile } from "@/types";
import {
  IoArrowBackOutline,
  IoPersonAddOutline,
  IoTrashOutline,
  IoCalendarOutline,
  IoCloseOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

interface CourseDetailManagerProps {
  course: Course;
  enrolledStudents: (UserProfile & { enrolled_at: string })[];
  availableStudents: UserProfile[];
}

export function CourseDetailManager({
  course,
  enrolledStudents: initialEnrolled,
  availableStudents,
}: CourseDetailManagerProps) {
  const [enrolled, setEnrolled] = useState(initialEnrolled);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const router = useRouter();

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    setIsSubmitting(true);
    const res = await enrollStudentAction({
      courseId: course.id,
      studentId: selectedStudentId,
    });

    if (res.success) {
      const newlyEnrolled = availableStudents.find((s) => s.id === selectedStudentId);
      if (newlyEnrolled) {
        setEnrolled((prev) => [
          ...prev,
          { ...newlyEnrolled, enrolled_at: new Date().toISOString() },
        ]);
      }
      setSelectedStudentId("");
      setIsEnrollModalOpen(false);
      router.refresh();
    } else {
      alert(`Enrollment failed: ${res.error}`);
    }
    setIsSubmitting(false);
  };

  const handleRemoveEnrollment = async (studentId: string) => {
    if (!confirm("Are you sure you want to remove this student from the course?")) return;

    setRemovingId(studentId);
    const res = await removeStudentEnrollmentAction({
      courseId: course.id,
      studentId,
    });

    if (res.success) {
      setEnrolled((prev) => prev.filter((s) => s.id !== studentId));
      router.refresh();
    } else {
      alert(`Failed to remove: ${res.error}`);
    }
    setRemovingId(null);
  };

  // Filter out already enrolled students
  const unrolledStudents = availableStudents.filter(
    (s) => !enrolled.some((e) => e.id === s.id)
  );

  return (
    <>
      <div className="mb-3">
        <Link
          href="/teacher/courses"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          <IoArrowBackOutline size={14} />
          <span>Back to Courses</span>
        </Link>
      </div>

      <DashboardHeader
        heading={`${course.name} (${course.code})`}
        text={course.description || "Course roster and enrollment management."}
      >
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <Link href={`/teacher/attendance?courseId=${course.id}`} className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto gap-1.5">
              <IoCalendarOutline size={15} />
              <span>Record Attendance</span>
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsEnrollModalOpen(true)}
            className="w-full sm:w-auto gap-1.5"
          >
            <IoPersonAddOutline size={15} />
            <span>Enroll Student</span>
          </Button>
        </div>
      </DashboardHeader>

      <Card className="p-4 sm:p-6">
        <CardHeader className="mb-3 sm:mb-4">
          <CardTitle className="text-base sm:text-lg">
            Enrolled Students ({enrolled.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrolled.length === 0 ? (
            <div className="p-8 text-center text-xs sm:text-sm text-muted-foreground">
              No students are currently enrolled in this course. Click "+ Enroll Student" to add members.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Email Address</TableHead>
                    <TableHead className="hidden md:table-cell">Enrolled Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrolled.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="font-medium text-foreground">
                        <div className="font-semibold text-sm">
                          {student.full_name || "Unnamed Student"}
                        </div>
                        <div className="sm:hidden text-xs text-muted-foreground">
                          {student.email}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {student.email}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                        {student.enrolled_at ? formatDate(student.enrolled_at) : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">ACTIVE</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={removingId === student.id}
                          onClick={() => handleRemoveEnrollment(student.id)}
                          className="text-xs px-2.5 py-1.5 min-h-[34px] gap-1 touch-manipulation"
                        >
                          <IoTrashOutline size={13} />
                          <span>{removingId === student.id ? "Removing..." : "Remove"}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enroll Student Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl bg-card text-card-foreground p-5 sm:p-6 shadow-2xl border border-border my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-foreground">Enroll Student in Course</h2>
              <button
                type="button"
                onClick={() => setIsEnrollModalOpen(false)}
                disabled={isSubmitting}
                className="text-muted-foreground hover:text-foreground p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-sm rounded-lg cursor-pointer hover:bg-muted touch-manipulation active:bg-muted"
                aria-label="Close modal"
              >
                <IoCloseOutline size={22} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Select an approved student from the directory to add to {course.name}.
            </p>

            {unrolledStudents.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground bg-muted/40 rounded-xl">
                All approved students in the directory are already enrolled in this course.
              </div>
            ) : (
              <form onSubmit={handleEnroll} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Select Student
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
                  >
                    <option value="">-- Choose a student --</option>
                    {unrolledStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.full_name} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEnrollModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || !selectedStudentId}
                    className="gap-1.5"
                  >
                    <IoCheckmarkCircleOutline size={16} />
                    <span>{isSubmitting ? "Enrolling..." : "Enroll Student"}</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
