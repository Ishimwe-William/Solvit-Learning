"use client";

import React, { useState, useEffect, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { updateUserPassword } from "@/app/(auth)/actions";
import { IoKeyOutline, IoCheckmarkCircleOutline, IoAlertCircleOutline } from "react-icons/io5";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createClient();
    const code = searchParams.get("code");

    // If landed directly with a PKCE code, exchange for session on the browser client
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          console.warn("Client-side code exchange note:", error.message);
        }
      });
    }

    // Check if recovery event fired
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setErrorMsg(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();

      // 1. Attempt client-side session password update
      const { error: clientError } = await supabase.auth.updateUser({
        password,
      });

      if (!clientError) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      // 2. Fallback to server-side action
      const formData = new FormData();
      formData.append("password", password);
      const result = await updateUserPassword(formData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setErrorMsg(
          clientError?.message ||
            result.error ||
            "Unable to establish auth session. Please request a fresh password reset link."
        );
      }
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
          <IoKeyOutline size={24} />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Set New Password
        </h1>
        <p className="text-xs text-muted-foreground mt-1.5 max-w-sm mx-auto">
          Choose a secure new password for your Solvit account.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
          <IoAlertCircleOutline size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {success ? (
        <div className="p-4 rounded-xl bg-success-subtle border border-success-subtle-foreground/20 text-success-subtle-foreground flex items-start gap-3">
          <IoCheckmarkCircleOutline size={22} className="shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-sm">Password Updated!</p>
            <p>Your password has been reset successfully. Redirecting you to sign in...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isPending}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
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
            {isPending ? "Updating Password..." : "Update Password"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-muted-foreground animate-pulse">Loading password recovery...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
