"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { generateRandomPassword } from "@/lib/utils";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddStudentModal({ isOpen, onClose }: AddMemberModalProps) {
  const [password, setPassword] = useState(generateRandomPassword());
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRegeneratePassword = () => {
    setPassword(generateRandomPassword());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-xl bg-card text-card-foreground p-5 sm:p-6 shadow-xl border border-border my-8">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-foreground">Add New Member</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 text-sm rounded-md cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Create an account with automated credentials.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
            <input
              type="email"
              placeholder="jane.doe@example.com"
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
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
                className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-xs sm:text-sm font-mono text-foreground"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleRegeneratePassword} title="Generate new password">
                🔄
              </Button>
            </div>
            <span className="text-[11px] text-muted-foreground">This password will be emailed to the member.</span>
          </div>

          {success && (
            <div className="rounded-lg bg-success-subtle p-2.5 text-xs text-success-subtle-foreground font-medium">
              ✓ Member account created! Credentials dispatched via email.
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              Create & Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
