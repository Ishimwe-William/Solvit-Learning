import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-8 sm:p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center flex flex-col items-center">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90">
            <Image
              src="/Primary-Horizontal.svg"
              alt="Logo"
              width={180}
              height={46}
              className="h-10 sm:h-11 w-auto object-contain"
              priority
            />
          </Link>
        </div>
        <div className="rounded-xl sm:rounded-2xl border border-border bg-card text-card-foreground p-5 sm:p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
