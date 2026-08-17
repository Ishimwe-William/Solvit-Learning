"use client";

import React, { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { AddStudentModal } from "@/components/teacher/AddStudentModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const mockMembers = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", status: "approved", joined: "Sep 01, 2026" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", status: "approved", joined: "Sep 01, 2026" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", status: "approved", joined: "Sep 05, 2026" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", status: "approved", joined: "Sep 12, 2026" },
];

export default function MembersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Member Directory"
        text="Manage enrolled accounts and register new members with automated secure credentials."
      >
        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          + Add New Member
        </Button>
      </DashboardHeader>

      <Card className="p-4 sm:p-6">
        <CardHeader className="mb-3 sm:mb-4">
          <CardTitle className="text-base sm:text-lg">Active Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Joined Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium text-foreground">
                    <div>{member.name}</div>
                    <div className="sm:hidden text-[11px] text-muted-foreground">{member.email}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{member.email}</TableCell>
                  <TableCell>
                    <Badge variant="success">{member.status.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{member.joined}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="text-xs px-2.5 py-1">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddStudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
