"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

interface MemberAttendanceRow {
  id: string;
  name: string;
  email: string;
  status: "present" | "absent" | "late" | "excused";
}

const mockMembers: MemberAttendanceRow[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", status: "present" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", status: "present" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", status: "late" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", status: "absent" },
];

export function AttendanceTable() {
  const [members, setMembers] = useState<MemberAttendanceRow[]>(mockMembers);

  const handleStatusChange = (id: string, newStatus: "present" | "absent" | "late" | "excused") => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            Select Date:
          </label>
          <input
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            className="w-full sm:w-auto rounded-lg border border-input bg-background px-3 py-1.5 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <Button variant="primary" size="sm" className="w-full sm:w-auto">
          Save All Records
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member Name</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Mark Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium text-foreground">
                <div>{member.name}</div>
                <div className="sm:hidden text-[11px] text-muted-foreground">{member.email}</div>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">{member.email}</TableCell>
              <TableCell>
                <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground">
                  {member.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStatusChange(member.id, "present")}
                    title="Present"
                    className={`px-2.5 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                      member.status === "present"
                        ? "bg-success text-success-foreground shadow-xs"
                        : "bg-muted text-muted-foreground hover:bg-success-subtle hover:text-success-subtle-foreground"
                    }`}
                  >
                    P
                  </button>
                  <button
                    onClick={() => handleStatusChange(member.id, "absent")}
                    title="Absent"
                    className={`px-2.5 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                      member.status === "absent"
                        ? "bg-destructive text-destructive-foreground shadow-xs"
                        : "bg-muted text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => handleStatusChange(member.id, "late")}
                    title="Late"
                    className={`px-2.5 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                      member.status === "late"
                        ? "bg-warning text-warning-foreground shadow-xs"
                        : "bg-muted text-muted-foreground hover:bg-warning-subtle hover:text-warning-subtle-foreground"
                    }`}
                  >
                    L
                  </button>
                  <button
                    onClick={() => handleStatusChange(member.id, "excused")}
                    title="Excused"
                    className={`px-2.5 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                      member.status === "excused"
                        ? "bg-info text-info-foreground shadow-xs"
                        : "bg-muted text-muted-foreground hover:bg-info-subtle hover:text-info-subtle-foreground"
                    }`}
                  >
                    E
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
