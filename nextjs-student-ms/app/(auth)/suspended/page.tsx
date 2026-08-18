import React from "react";
import { Button } from "@/components/ui/Button";
import { IoWarningOutline } from "react-icons/io5";
import { logout } from "@/app/(auth)/actions";

export default function SuspendedPage() {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center items-center">
        <div className="p-3 rounded-full bg-destructive/10 text-destructive">
          <IoWarningOutline size={44} />
        </div>
      </div>

      <h1 className="text-xl font-bold text-foreground">
        Account Inactive or Suspended
      </h1>

      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        Your account access has been suspended or registration was declined by the administration.
      </p>

      <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium">
        If you believe this is an error, please contact your school or system administrator for assistance.
      </div>

      <div className="pt-2 flex justify-center">
        <form action={logout}>
          <Button variant="outline" size="sm">
            Sign Out & Return to Login
          </Button>
        </form>
      </div>
    </div>
  );
}
