"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { sendEmail } from "@/lib/emails/actions";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline, IoHourglassOutline } from "react-icons/io5";

interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
}

interface ApprovalsTableProps {
    initialUsers: UserProfile[];
}

const statusVariantMap: Record<string, "success" | "warning" | "destructive" | "default"> = {
    approved: "success",
    pending: "warning",
    suspended: "destructive",
    rejected: "destructive",
};

export function ApprovalsTable({ initialUsers = [] }: ApprovalsTableProps) {
    const [users, setUsers] = useState<UserProfile[]>(initialUsers);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"approved" | "rejected" | null>(null);
    const router = useRouter();

    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    const handleUpdateStatus = async (userId: string, newStatus: "approved" | "rejected") => {
        setProcessingId(userId);
        setActionType(newStatus);
        const supabase = createClient();
        const targetUser = users.find((u) => u.id === userId);

        const { data, error } = await supabase
            .from("profiles")
            .update({ status: newStatus })
            .eq("id", userId)
            .select()
            .single();

        if (!error) {
            // Optimistically remove from pending list
            setUsers((prev) => prev.filter((u) => u.id !== userId));

            const recipientEmail = data?.email || targetUser?.email;
            if (recipientEmail) {
                const recipientName = data?.full_name || targetUser?.full_name || "Student";
                await sendEmail({
                    to: recipientEmail,
                    subject:
                        newStatus === "approved"
                            ? "Your Account Has Been Approved!"
                            : "Account Registration Status",
                    htmlData:
                        newStatus === "approved"
                            ? `
                                <h2>Hello ${recipientName},</h2>
                                <p>Great news! Your student account has been <strong>approved</strong>.</p>
                                <p>You can now log in to the portal to view your attendance history and submit leave requests.</p>
                                <br/>
                                <p>Best regards,<br/>Solvit Academic Team</p>
                              `
                            : `
                                <h2>Hello ${recipientName},</h2>
                                <p>Your registration request was reviewed and has been <strong>declined</strong>.</p>
                                <p>If you believe this was in error, please contact your administration office.</p>
                              `,
                    appName: "Solvit Student MS",
                });
            }
            router.refresh();
        } else {
            alert(`Failed to update status: ${error.message}`);
        }

        setProcessingId(null);
        setActionType(null);
    };

    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
                <div className="p-3 rounded-full bg-muted/60 text-muted-foreground mb-3">
                    <IoHourglassOutline size={32} />
                </div>
                <h3 className="text-sm font-semibold text-foreground">No Pending Registrations</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    All student accounts have been reviewed. New registration requests will appear here automatically.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Email Address</TableHead>
                        <TableHead className="hidden md:table-cell">Registered Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Review Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => {
                        const isProcessing = processingId === user.id;
                        const formattedDate = user.created_at
                            ? new Date(user.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                              })
                            : "N/A";

                        return (
                            <TableRow key={user.id} className="hover:bg-muted/40 transition-colors">
                                <TableCell className="font-medium text-foreground">
                                    <div className="font-semibold text-sm">{user.full_name || "Unnamed User"}</div>
                                    <div className="sm:hidden text-xs text-muted-foreground">{user.email}</div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                                    {user.email}
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                                    {formattedDate}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusVariantMap[user.status] || "warning"}>
                                        {user.status ? user.status.toUpperCase() : "PENDING"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="primary"
                                            className="px-3 py-1.5 text-xs font-medium gap-1.5 min-h-[34px] touch-manipulation"
                                            disabled={isProcessing}
                                            onClick={() => handleUpdateStatus(user.id, "approved")}
                                        >
                                            <IoCheckmarkCircleOutline size={15} />
                                            {isProcessing && actionType === "approved" ? "Approving..." : "Approve"}
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="destructive"
                                            className="px-3 py-1.5 text-xs font-medium gap-1.5 min-h-[34px] touch-manipulation"
                                            disabled={isProcessing}
                                            onClick={() => handleUpdateStatus(user.id, "rejected")}
                                        >
                                            <IoCloseCircleOutline size={15} />
                                            {isProcessing && actionType === "rejected" ? "Rejecting..." : "Reject"}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}