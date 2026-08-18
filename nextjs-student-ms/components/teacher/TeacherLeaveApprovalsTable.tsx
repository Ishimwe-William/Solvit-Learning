"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { reviewTeacherLeaveAction } from "@/app/(dashboard)/student/leave/actions";
import { LeaveRequest } from "@/types";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoHourglassOutline,
} from "react-icons/io5";

interface TeacherLeaveApprovalsTableProps {
  initialRequests: LeaveRequest[];
}

export function TeacherLeaveApprovalsTable({
  initialRequests = [],
}: TeacherLeaveApprovalsTableProps) {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"approved" | "rejected" | null>(null);
  const router = useRouter();

  const handleReview = async (
    requestId: string,
    status: "approved" | "rejected"
  ) => {
    setProcessingId(requestId);
    setActionType(status);

    const result = await reviewTeacherLeaveAction({
      requestId,
      status,
    });

    if (result.success && result.request) {
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status } : r))
      );
      router.refresh();
    } else {
      alert(`Failed to update leave request: ${result.error}`);
    }

    setProcessingId(null);
    setActionType(null);
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      case "pending":
      default:
        return "warning";
    }
  };

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
        <div className="p-3 rounded-full bg-muted/60 text-muted-foreground mb-3">
          <IoHourglassOutline size={32} />
        </div>
        <h3 className="text-sm font-semibold text-foreground">No Absence Requests Found</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          No student leave or sick day requests have been submitted yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="hidden md:table-cell">Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((req) => {
            const isProcessing = processingId === req.id;

            return (
              <TableRow key={req.id} className="hover:bg-muted/40 transition-colors">
                <TableCell className="font-medium text-foreground">
                  <div className="font-semibold text-sm">
                    {req.student?.full_name || "Student"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {req.student?.email}
                  </div>
                </TableCell>
                <TableCell className="capitalize text-xs sm:text-sm text-foreground whitespace-nowrap">
                  {req.type}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {req.course?.name ? `${req.course.name} (${req.course.code})` : "All Courses"}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(req.start_date)} - {formatDate(req.end_date)}
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-xs truncate text-xs text-foreground">
                  {req.reason}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(req.status)}>
                    {req.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {req.status === "pending" ? (
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        disabled={isProcessing}
                        onClick={() => handleReview(req.id, "approved")}
                        className="px-2.5 py-1.5 text-xs gap-1 min-h-[34px] touch-manipulation"
                      >
                        <IoCheckmarkCircleOutline size={14} />
                        <span>
                          {isProcessing && actionType === "approved" ? "Approving..." : "Approve"}
                        </span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        disabled={isProcessing}
                        onClick={() => handleReview(req.id, "rejected")}
                        className="px-2.5 py-1.5 text-xs gap-1 min-h-[34px] touch-manipulation"
                      >
                        <IoCloseCircleOutline size={14} />
                        <span>
                          {isProcessing && actionType === "rejected" ? "Rejecting..." : "Reject"}
                        </span>
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Resolved</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
