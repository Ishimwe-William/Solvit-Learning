"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

export function LeaveRequestForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div>
        <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
          Leave Category
        </label>
        <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none">
          <option value="sick">Sick Leave</option>
          <option value="personal">Personal Leave</option>
          <option value="emergency">Emergency Absence</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
            Start Date
          </label>
          <input
            type="date"
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
            End Date
          </label>
          <input
            type="date"
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
          Reason for Leave
        </label>
        <textarea
          rows={3}
          required
          placeholder="Please provide details for this absence request..."
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none resize-y"
        />
      </div>

      {submitted && (
        <div className="rounded-lg bg-success-subtle p-3 text-xs sm:text-sm text-success-subtle-foreground font-medium">
          ✓ Leave request submitted for review!
        </div>
      )}

      <Button type="submit" variant="primary" className="w-full sm:w-auto">
        Submit Request
      </Button>
    </form>
  );
}
