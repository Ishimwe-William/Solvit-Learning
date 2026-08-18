import React, { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-muted-foreground animate-pulse">Loading...</div>}>
      <AuthForm initialMode="signin" />
    </Suspense>
  );
}

