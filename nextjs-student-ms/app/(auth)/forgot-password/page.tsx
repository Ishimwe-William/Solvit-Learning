"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { requestPasswordReset } from "@/app/(auth)/actions";
import { IoMailOutline, IoArrowBackOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append("email", email);

    startTransition(async () => {
      const result = await requestPasswordReset(formData);
      if (result.success) {
        setSuccessMsg(result.message || "Password reset instructions sent!");
      } else {
        setErrorMsg(result.error || "Failed to send reset link.");
      }
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
          <IoMailOutline size={24} />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Reset Your Password
        </h1>
        <p className="text-xs text-muted-foreground mt-1.5 max-w-sm mx-auto">
          Enter the email address linked to your Solvit account and we will send you a secure password reset link.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {successMsg ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-success-subtle border border-success-subtle-foreground/20 text-success-subtle-foreground flex items-start gap-3">
            <IoCheckmarkCircleOutline size={20} className="shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold">Reset Link Sent</p>
              <p>Check your inbox at <strong>{email}</strong> for instructions to reset your password.</p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
            >
              <IoArrowBackOutline size={14} />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Account Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 text-sm"
            disabled={isPending}
          >
            {isPending ? "Sending Reset Link..." : "Send Reset Email"}
          </Button>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <IoArrowBackOutline size={14} />
              <span>Return to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
