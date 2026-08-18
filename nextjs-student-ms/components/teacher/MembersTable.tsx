"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { AddStudentModal } from "@/components/teacher/AddStudentModal";
import { ViewMemberModal } from "@/components/teacher/ViewMemberModal";
import { IoEyeOutline, IoPersonAddOutline } from "react-icons/io5";

interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
}

interface MembersTableProps {
    initialUsers: UserProfile[];
}

export function MembersTable({ initialUsers = [] }: MembersTableProps) {
    const [users, setUsers] = useState<UserProfile[]>(initialUsers);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    function getStatusVariant(status: string) {
        switch (status?.toLowerCase()) {
            case "approved":
                return "success";
            case "pending":
                return "warning";
            case "suspended":
            case "rejected":
                return "destructive";
            default:
                return "default";
        }
    }

    const handleMemberAdded = (newMember: UserProfile) => {
        setUsers((prev) => [newMember, ...prev]);
        router.refresh();
    };

    const handleMemberUpdated = (updatedMember: UserProfile) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === updatedMember.id ? { ...u, ...updatedMember } : u))
        );
        setSelectedMember(updatedMember);
        router.refresh();
    };

    const handleViewMember = (member: UserProfile) => {
        setSelectedMember(member);
        setIsViewModalOpen(true);
    };

    return (
        <>
            <DashboardHeader
                heading="Members Directory"
                text="Manage enrolled accounts and register new members with automated secure credentials."
            >
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full sm:w-auto gap-2"
                >
                    <IoPersonAddOutline size={16} />
                    <span>Add New Member</span>
                </Button>
            </DashboardHeader>

            <Card className="p-4 sm:p-6">
                <CardHeader className="mb-3 sm:mb-4">
                    <CardTitle className="text-base sm:text-lg">
                        Enrolled Members ({users.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {users.length === 0 ? (
                        <div className="p-8 text-center text-xs sm:text-sm text-muted-foreground">
                            No enrolled members found. Click "+ Add New Member" above to create one.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                                        <TableHead className="hidden sm:table-cell">Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden md:table-cell">Joined Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((member) => (
                                        <TableRow key={member.id} className="hover:bg-muted/40 transition-colors">
                                            <TableCell className="font-medium text-foreground">
                                                <div className="font-semibold text-sm">
                                                    {member.full_name || "Unnamed User"}
                                                </div>
                                                <div className="sm:hidden text-[11px] text-muted-foreground">
                                                    {member.email}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                                                {member.email}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                                                    {member.role}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(member.status)}>
                                                    {member.status ? member.status.toUpperCase() : "PENDING"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                                                {member.created_at ? formatDate(member.created_at) : "N/A"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewMember(member)}
                                                    className="text-xs px-3 py-1 gap-1.5 font-medium hover:bg-muted"
                                                >
                                                    <IoEyeOutline size={14} />
                                                    <span>View</span>
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

            <AddStudentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onMemberAdded={handleMemberAdded}
            />

            <ViewMemberModal
                member={selectedMember}
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedMember(null);
                }}
                onMemberUpdated={handleMemberUpdated}
            />
        </>
    );
}