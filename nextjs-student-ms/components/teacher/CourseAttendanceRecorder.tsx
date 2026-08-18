"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { saveCourseAttendanceAction } from "@/app/(dashboard)/teacher/attendance/actions";
import { Course, UserProfile, AttendanceStatus } from "@/types";
import {
  IoCalendarOutline,
  IoSaveOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";

interface StudentAttendanceState {
  studentId: string;
  name: string;
  email: string;
  status: AttendanceStatus;
  remarks: string;
}

interface CourseAttendanceRecorderProps {
  courses: Course[];
  initialCourseId?: string;
  enrolledStudentsMap: Record<string, UserProfile[]>;
  existingAttendanceMap: Record<string, Record<string, { status: AttendanceStatus; remarks?: string }>>;
}

export function CourseAttendanceRecorder({
  courses,
  initialCourseId,
  enrolledStudentsMap,
  existingAttendanceMap,
}: CourseAttendanceRecorderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const preselectedCourse =
    searchParams.get("courseId") ||
    initialCourseId ||
    (courses.length > 0 ? courses[0].id : "");

  const [selectedCourseId, setSelectedCourseId] = useState(preselectedCourse);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendance, setAttendance] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const enrolledStudents = enrolledStudentsMap[selectedCourseId] || [];

  // Sync attendance state when course or date changes
  useEffect(() => {
    const existing = existingAttendanceMap[`${selectedCourseId}_${selectedDate}`] || {};
    const newAttendance: Record<string, { status: AttendanceStatus; remarks: string }> = {};

    enrolledStudents.forEach((student) => {
      newAttendance[student.id] = {
        status: existing[student.id]?.status || "present",
        remarks: existing[student.id]?.remarks || "",
      };
    });

    setAttendance(newAttendance);
    setSaveSuccess(null);
    setSaveError(null);
  }, [selectedCourseId, selectedDate, enrolledStudentsMap, existingAttendanceMap]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    enrolledStudents.forEach((student) => {
      updated[student.id] = {
        status,
        remarks: attendance[student.id]?.remarks || "",
      };
    });
    setAttendance(updated);
  };

  const handleSave = async () => {
    if (!selectedCourseId || enrolledStudents.length === 0) return;

    setIsSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    const records = enrolledStudents.map((s) => ({
      studentId: s.id,
      status: attendance[s.id]?.status || ("present" as AttendanceStatus),
      remarks: attendance[s.id]?.remarks || "",
    }));

    const result = await saveCourseAttendanceAction({
      courseId: selectedCourseId,
      date: selectedDate,
      records,
    });

    if (result.success) {
      setSaveSuccess(`Successfully saved attendance for ${records.length} students!`);
      setTimeout(() => {
        setSaveSuccess(null);
        router.refresh();
      }, 2500);
    } else {
      setSaveError(result.error || "Failed to save attendance records");
    }

    setIsSaving(false);
  };

  return (
    <>
      <DashboardHeader
        heading="Record Class Attendance"
        text="Log and update student presence, tardiness, and excused absences by course roster."
      />

      <Card className="p-4 sm:p-6 space-y-4">
        {/* Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-end pb-4 border-b border-border">
          {/* Course Selector */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Select Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              {courses.length === 0 && <option value="">No courses available</option>}
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Quick Mark & Save Buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll("present")}
              className="w-full text-xs gap-1 py-2"
              title="Mark all enrolled students present"
            >
              <IoCheckmarkDoneOutline size={15} />
              <span>All Present</span>
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={isSaving || enrolledStudents.length === 0}
              onClick={handleSave}
              className="w-full text-xs gap-1.5 py-2 font-semibold"
            >
              <IoSaveOutline size={15} />
              <span>{isSaving ? "Saving..." : "Save Records"}</span>
            </Button>
          </div>
        </div>

        {/* Status Alerts */}
        {saveSuccess && (
          <div className="rounded-lg bg-success-subtle border border-success-subtle-foreground/20 p-3 text-xs text-success-subtle-foreground font-medium flex items-center gap-2">
            <IoCheckmarkCircleOutline size={18} className="shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {saveError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium flex items-center gap-2">
            <IoCloseCircleOutline size={18} className="shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Student Roster Table */}
        {enrolledStudents.length === 0 ? (
          <div className="p-8 text-center text-xs sm:text-sm text-muted-foreground">
            No students are currently enrolled in this course. Go to the course roster to enroll members.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Attendance Status</TableHead>
                  <TableHead className="hidden md:table-cell">Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolledStudents.map((student) => {
                  const currentStatus = attendance[student.id]?.status || "present";
                  const currentRemarks = attendance[student.id]?.remarks || "";

                  return (
                    <TableRow key={student.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="font-medium text-foreground">
                        <div className="font-semibold text-sm">
                          {student.full_name || "Unnamed Student"}
                        </div>
                        <div className="sm:hidden text-xs text-muted-foreground">
                          {student.email}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                        {student.email}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-1.5 py-1">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, "present")}
                            className={`px-3 py-2 min-h-[36px] text-xs font-bold rounded-lg transition-all cursor-pointer touch-manipulation active:scale-95 flex items-center justify-center ${
                              currentStatus === "present"
                                ? "bg-success text-success-foreground shadow-xs ring-2 ring-success/30"
                                : "bg-muted text-muted-foreground hover:bg-success-subtle hover:text-success-subtle-foreground"
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, "absent")}
                            className={`px-3 py-2 min-h-[36px] text-xs font-bold rounded-lg transition-all cursor-pointer touch-manipulation active:scale-95 flex items-center justify-center ${
                              currentStatus === "absent"
                                ? "bg-destructive text-destructive-foreground shadow-xs ring-2 ring-destructive/30"
                                : "bg-muted text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, "late")}
                            className={`px-3 py-2 min-h-[36px] text-xs font-bold rounded-lg transition-all cursor-pointer touch-manipulation active:scale-95 flex items-center justify-center ${
                              currentStatus === "late"
                                ? "bg-warning text-warning-foreground shadow-xs ring-2 ring-warning/30"
                                : "bg-muted text-muted-foreground hover:bg-warning-subtle hover:text-warning-subtle-foreground"
                            }`}
                          >
                            Late
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, "excused")}
                            className={`px-3 py-2 min-h-[36px] text-xs font-bold rounded-lg transition-all cursor-pointer touch-manipulation active:scale-95 flex items-center justify-center ${
                              currentStatus === "excused"
                                ? "bg-info text-info-foreground shadow-xs ring-2 ring-info/30"
                                : "bg-muted text-muted-foreground hover:bg-info-subtle hover:text-info-subtle-foreground"
                            }`}
                          >
                            Excused
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <input
                          type="text"
                          placeholder="Optional note..."
                          value={currentRemarks}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </>
  );
}
