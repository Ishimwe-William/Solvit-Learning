"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { updateMemberAction } from "@/app/(dashboard)/teacher/students/actions";
import {
  IoMailOutline,
  IoCalendarOutline,
  IoShieldCheckmarkOutline,
  IoPersonOutline,
  IoPencilOutline,
  IoCheckmarkOutline,
  IoKeyOutline,
  IoCloseOutline,
} from "react-icons/io5";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

interface ViewMemberModalProps {
  member: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onMemberUpdated?: (updatedMember: UserProfile) => void;
}

export function ViewMemberModal({
  member,
  isOpen,
  onClose,
  onMemberUpdated,
}: ViewMemberModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "teacher" | "admin">("student");
  const [status, setStatus] = useState<"approved" | "pending" | "suspended">("approved");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (member) {
      setFullName(member.full_name || "");
      setRole((member.role as any) || "student");
      setStatus((member.status as any) || "approved");
      setIsEditing(false);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [member, isOpen]);

  if (!isOpen || !member) return null;

  const getStatusVariant = (statusStr: string) => {
    switch (statusStr.toLowerCase()) {
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
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSaving(true);

    try {
      const result = await updateMemberAction({
        id: member.id,
        fullName: fullName.trim(),
        role,
        status,
      });

      if (!result.success) {
        setErrorMsg(result.error || "Failed to update member details");
        setIsSaving(false);
        return;
      }

      const updated = {
        ...member,
        full_name: fullName.trim(),
        role,
        status,
      };

      setSuccessMsg("Member details updated successfully!");
      if (onMemberUpdated) {
        onMemberUpdated(updated);
      }

      setTimeout(() => {
        setIsSaving(false);
        setIsEditing(false);
        setSuccessMsg(null);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFullName(member.full_name || "");
    setRole((member.role as any) || "student");
    setStatus((member.status as any) || "approved");
    setIsEditing(false);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-card text-card-foreground p-6 shadow-2xl border border-border my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg uppercase border border-primary/20">
              {(isEditing ? fullName : member.full_name)?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground leading-tight">
                {isEditing ? "Edit Member Details" : member.full_name || "Unnamed Member"}
              </h2>
              <p className="text-xs text-muted-foreground capitalize">
                {member.role} Account
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-muted-foreground hover:text-foreground p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-sm rounded-lg hover:bg-muted transition-colors cursor-pointer disabled:opacity-50 touch-manipulation active:bg-muted"
            aria-label="Close modal"
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        {/* Content Details / Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSave} className="py-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isSaving}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                value={member.email}
                readOnly
                disabled
                className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  System Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  disabled={isSaving}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher / Staff</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Account Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  disabled={isSaving}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending Review</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive font-medium">
                ✕ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="rounded-lg bg-success-subtle p-2.5 text-xs text-success-subtle-foreground font-medium">
                ✓ {successMsg}
              </div>
            )}

            {/* Footer Form Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSaving}
                className="gap-1.5"
              >
                <IoCheckmarkOutline size={16} />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Email */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <IoMailOutline size={16} />
                  <span>Email Address</span>
                </div>
                <p className="text-sm font-medium text-foreground break-all">{member.email}</p>
              </div>

              {/* Role */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <IoPersonOutline size={16} />
                  <span>System Role</span>
                </div>
                <p className="text-sm font-medium text-foreground capitalize">{member.role}</p>
              </div>

              {/* Status */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1.5">
                  <IoShieldCheckmarkOutline size={16} />
                  <span>Account Status</span>
                </div>
                <Badge variant={getStatusVariant(member.status)}>
                  {member.status.toUpperCase()}
                </Badge>
              </div>

              {/* Joined Date */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <IoCalendarOutline size={16} />
                  <span>Registration Date</span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {member.created_at ? formatDate(member.created_at) : "N/A"}
                </p>
              </div>
            </div>

            {/* Member ID */}
            <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
              <span className="text-[11px] text-muted-foreground block mb-0.5">User ID</span>
              <code className="text-xs text-foreground font-mono select-all break-all">{member.id}</code>
            </div>

            {/* Reset Password Action Row */}
            <div className="p-3.5 rounded-xl bg-muted/30 border border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-foreground">Password Recovery</p>
                <p className="text-[11px] text-muted-foreground">Send a direct password reset email to this user</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={async () => {
                  const formData = new FormData();
                  formData.append("email", member.email);
                  const { requestPasswordReset } = await import("@/app/(auth)/actions");
                  const res = await requestPasswordReset(formData);
                  if (res.success) {
                    alert(`Password reset link dispatched to ${member.email}`);
                  } else {
                    alert(`Failed to send reset link: ${res.error}`);
                  }
                }}
                className="w-full sm:w-auto text-xs gap-1.5 font-medium min-h-[38px] touch-manipulation"
              >
                <IoKeyOutline size={14} />
                <span>Send Reset Link</span>
              </Button>
            </div>

            {/* Footer View Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-2 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto gap-1.5 hover:bg-muted font-medium min-h-[38px] touch-manipulation"
              >
                <IoPencilOutline size={14} />
                <span>Edit Member</span>
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onClose}
                className="w-full sm:w-auto px-6 min-h-[38px] touch-manipulation"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

