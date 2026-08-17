"use client";

import React, { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface PendingAccount {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
}

const initialPending: PendingAccount[] = [
  { id: "1", name: "David Miller", email: "david.m@example.com", registeredAt: "2 hours ago" },
  { id: "2", name: "Emma Watson", email: "emma.w@example.com", registeredAt: "5 hours ago" },
  { id: "3", name: "Frank Wright", email: "frank.w@example.com", registeredAt: "1 day ago" },
];

export default function AccountApprovalsPage() {
  const [pending, setPending] = useState(initialPending);

  const handleApprove = (id: string) => {
    setPending((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Account Approvals"
        text="Review and approve newly registered user accounts before granting full portal access."
      />

      <Card className="p-4 sm:p-6">
        <CardHeader className="mb-3 sm:mb-4">
          <CardTitle className="text-base sm:text-lg">Pending Registrations ({pending.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <div className="p-8 text-center text-xs sm:text-sm text-muted-foreground">
              🎉 No pending registrations to review!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email Address</TableHead>
                  <TableHead className="hidden md:table-cell">Registered</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Review Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-foreground">
                      <div>{user.name}</div>
                      <div className="sm:hidden text-[11px] text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{user.email}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{user.registeredAt}</TableCell>
                    <TableCell>
                      <Badge variant="warning">PENDING</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          className="px-2 py-1 text-xs"
                          onClick={() => handleApprove(user.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="px-2 py-1 text-xs"
                          onClick={() => handleApprove(user.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
