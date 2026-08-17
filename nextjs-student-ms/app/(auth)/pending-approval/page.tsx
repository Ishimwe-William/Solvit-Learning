import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {IoHourglassOutline} from "react-icons/io5";
import {logout} from "@/app/(auth)/actions";

export default function PendingApprovalPage() {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center items-center">
        <IoHourglassOutline size={48} color={"var(--info)"}/>
    </div>
        <h1 className="text-xl font-bold text-foreground">
        Account Pending Review
      </h1>
      <p className="text-sm text-muted-foreground">
        Your registration has been received and is currently under review before full access is granted.
      </p>
      <div className="rounded-lg bg-warning-subtle p-3 text-xs text-warning-subtle-foreground font-medium">
        You will receive an email confirmation once your account has been reviewed.
      </div>
      <div className="pt-2">
        <form action={logout}>
          <Button variant="outline" size="sm">
            Back to Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
