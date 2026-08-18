import React, { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-muted-foreground animate-pulse">Loading...</div>}>
      <AuthForm initialMode="signup" />
    </Suspense>
  );
}

