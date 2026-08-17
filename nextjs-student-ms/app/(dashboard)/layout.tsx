"use client";

import React, { useState, ReactNode } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Sidebar } from "@/components/shared/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        isMobileMenuOpen={mobileMenuOpen}
      />
      <div className="flex flex-1 relative">
        <Sidebar
          isOpenOnMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
        <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-muted/20">
          <div className="max-w-6xl mx-auto space-y-6">
            <React.Suspense fallback={<div className="p-6 text-sm text-muted-foreground animate-pulse">Loading content...</div>}>
              {children}
            </React.Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
