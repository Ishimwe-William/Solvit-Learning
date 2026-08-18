"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { submitStudentLeaveAction } from "@/app/(dashboard)/student/leave/actions";
import { Course, LeaveType } from "@/types";
import {
  IoPaperPlaneOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoCalendarOutline,
} from "react-icons/io5";

interface LeaveRequestFormProps {
  enrolledCourses: Course[];
  onLeaveSubmitted?: (newRequest: any) => void;
}

export function LeaveRequestForm({
  enrolledCourses = [],
  onLeaveSubmitted,
}: LeaveRequestFormProps) {
  const [courseId, setCourseId] = useState("");
  const [type, setType] = useState<LeaveType>("sick");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const result = await submitStudentLeaveAction({
        courseId: courseId || undefined,
        type,
        startDate,
        endDate,
        reason,
      });

      if (!result.success) {
        setErrorMsg(result.error || "Failed to submit leave request");
        setIsSubmitting(false);
        return;
      }

      setSuccessMsg("Leave request submitted successfully for administrative review!");
      if (result.request && onLeaveSubmitted) {
        onLeaveSubmitted(result.request);
      }

      // Reset form
      setReason("");
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMsg(null);
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* Course and Category Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Course / Subject (Optional)
          </label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          >
            <option value="">-- All Enrolled Courses / General --</option>
            {enrolledCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Leave Category
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as LeaveType)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          >
            <option value="sick">Medical / Sick Leave</option>
            <option value="personal">Personal Leave</option>
            <option value="emergency">Emergency Absence</option>
          </select>
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
            <IoCalendarOutline size={13} />
            <span>Start Date</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            disabled={isSubmitting}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
            <IoCalendarOutline size={13} />
            <span>End Date</span>
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            disabled={isSubmitting}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>
      </div>

      {/* Reason */}
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1">
          Detailed Reason for Absence
        </label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          disabled={isSubmitting}
          placeholder="Please explain the reason for this absence or provide relevant medical/event context..."
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none resize-y disabled:opacity-50"
        />
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium flex items-center gap-2">
          <IoCloseCircleOutline size={18} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="rounded-lg bg-success-subtle border border-success-subtle-foreground/20 p-3 text-xs sm:text-sm text-success-subtle-foreground font-medium flex items-center gap-2">
          <IoCheckmarkCircleOutline size={18} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="w-full sm:w-auto gap-1.5 font-medium"
      >
        <IoPaperPlaneOutline size={15} />
        <span>{isSubmitting ? "Submitting..." : "Submit Leave Application"}</span>
      </Button>
    </form>
  );
}
