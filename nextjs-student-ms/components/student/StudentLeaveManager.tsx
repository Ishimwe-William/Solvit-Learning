"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { LeaveRequestForm } from "@/components/student/LeaveRequestForm";
import { formatDate } from "@/lib/utils";
import { Course, LeaveRequest } from "@/types";
import { IoHourglassOutline } from "react-icons/io5";

interface StudentLeaveManagerProps {
  enrolledCourses: Course[];
  initialRequests: LeaveRequest[];
}

export function StudentLeaveManager({
  enrolledCourses,
  initialRequests = [],
}: StudentLeaveManagerProps) {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);

  const handleLeaveSubmitted = (newRequest: LeaveRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
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

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <CardHeader className="mb-3 sm:mb-4">
          <CardTitle className="text-base sm:text-lg">New Leave Application</CardTitle>
        </CardHeader>
        <CardContent>
          <LeaveRequestForm
            enrolledCourses={enrolledCourses}
            onLeaveSubmitted={handleLeaveSubmitted}
          />
        </CardContent>
      </Card>

      <Card className="p-4 sm:p-6">
        <CardHeader className="mb-3 sm:mb-4">
          <CardTitle className="text-base sm:text-lg">
            My Leave Request History ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="p-8 text-center text-xs sm:text-sm text-muted-foreground flex flex-col items-center">
              <IoHourglassOutline size={30} className="mb-2 text-muted-foreground" />
              <span>You have not submitted any leave requests yet.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="hidden md:table-cell">Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="font-medium capitalize text-sm text-foreground">
                        {req.type}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {req.course?.name ? `${req.course.name} (${req.course.code})` : "General"}
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
