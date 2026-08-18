"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { generateRandomPassword } from "@/lib/utils";
import { addMemberAction } from "@/app/(dashboard)/teacher/students/actions";
import { IoReloadOutline, IoCloseOutline, IoCloseCircleOutline, IoCheckmarkCircleOutline, IoPersonAddOutline } from "react-icons/io5";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded?: (newMember: UserProfile) => void;
}

export function AddStudentModal({ isOpen, onClose, onMemberAdded }: AddMemberModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [password, setPassword] = useState(generateRandomPassword(10));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegeneratePassword = () => {
    setPassword(generateRandomPassword(10));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const result = await addMemberAction({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      if (!result.success) {
        setErrorMsg(result.error || "Failed to create member");
        setIsSubmitting(false);
        return;
      }

      setSuccessMsg(`Member created successfully! Credentials emailed to ${email}.`);

      if (result.user && onMemberAdded) {
        onMemberAdded(result.user as UserProfile);
      }

      // Reset form
      setTimeout(() => {
        setFullName("");
        setEmail("");
        setPassword(generateRandomPassword(10));
        setIsSubmitting(false);
        setSuccessMsg(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl bg-card text-card-foreground p-5 sm:p-6 shadow-2xl border border-border my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-foreground">Add New Member</h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-sm rounded-lg cursor-pointer disabled:opacity-50 hover:bg-muted touch-manipulation active:bg-muted"
            aria-label="Close modal"
          >
            <IoCloseOutline size={22} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Create an active member account with automated login credentials.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
            <input
              type="email"
              placeholder="jane.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "student" | "teacher")}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher / Staff</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Generated Random Password
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={password}
                className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-xs sm:text-sm font-mono text-foreground font-semibold"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRegeneratePassword}
                disabled={isSubmitting}
                title="Generate new password"
                className="px-3"
              >
                <IoReloadOutline size={15} />
              </Button>
            </div>
            <span className="text-[11px] text-muted-foreground block mt-1">
              This password will be securely emailed to the member automatically.
            </span>
          </div>

          {errorMsg && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive font-medium flex items-center gap-2">
              <IoCloseCircleOutline size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="rounded-lg bg-success-subtle p-2.5 text-xs text-success-subtle-foreground font-medium flex items-center gap-2">
              <IoCheckmarkCircleOutline size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full sm:w-auto gap-1.5"
            >
              <IoPersonAddOutline size={16} />
              <span>{isSubmitting ? "Creating & Sending..." : "Create & Send Credentials"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

