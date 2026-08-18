import React from "react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-muted rounded-lg" />
          <div className="h-4 w-72 bg-muted/60 rounded-md" />
        </div>
        <div className="h-9 w-32 bg-muted rounded-lg" />
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-xl border border-border bg-card space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="h-6 w-6 bg-muted rounded-full" />
            </div>
            <div className="h-8 w-16 bg-muted rounded-md" />
            <div className="h-3 w-32 bg-muted/60 rounded" />
          </div>
        ))}
      </div>

      {/* Main content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card space-y-4">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-56 bg-muted/30 rounded-lg flex items-end justify-between p-6 gap-3">
            {[40, 75, 60, 90, 85, 70, 95].map((h, idx) => (
              <div
                key={idx}
                className="w-full bg-muted rounded-t-md"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card space-y-4">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/30 flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-20 bg-muted/60 rounded" />
                </div>
                <div className="h-6 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
