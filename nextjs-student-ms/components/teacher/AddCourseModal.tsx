"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createCourseAction } from "@/app/(dashboard)/teacher/courses/actions";
import { IoCloseOutline, IoBookOutline, IoCloseCircleOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated?: (course: any) => void;
}

export function AddCourseModal({ isOpen, onClose, onCourseCreated }: AddCourseModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const result = await createCourseAction({
        name,
        code,
        description,
      });

      if (!result.success) {
        setErrorMsg(result.error || "Failed to create course");
        setIsSubmitting(false);
        return;
      }

      setSuccessMsg("Course created successfully!");

      if (result.course && onCourseCreated) {
        onCourseCreated(result.course);
      }

      setTimeout(() => {
        setName("");
        setCode("");
        setDescription("");
        setIsSubmitting(false);
        setSuccessMsg(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl bg-card text-card-foreground p-5 sm:p-6 shadow-2xl border border-border my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <IoBookOutline size={20} />
            </div>
            <h2 className="text-lg font-bold text-foreground">Add New Course</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-sm rounded-lg cursor-pointer disabled:opacity-50 hover:bg-muted touch-manipulation active:bg-muted"
            aria-label="Close modal"
          >
            <IoCloseOutline size={22} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Create an academic subject or course offering for attendance and leaves.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Course Name
            </label>
            <input
              type="text"
              placeholder="e.g. Advanced Web Engineering"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Course Code
            </label>
            <input
              type="text"
              placeholder="e.g. CS301"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground uppercase focus:border-primary focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Brief course objectives and syllabus summary..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none resize-y disabled:opacity-50"
            />
          </div>

          {errorMsg && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive font-medium flex items-center gap-2">
              <IoCloseCircleOutline size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="rounded-lg bg-success-subtle p-2.5 text-xs text-success-subtle-foreground font-medium flex items-center gap-2">
              <IoCheckmarkCircleOutline size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full sm:w-auto gap-1.5"
            >
              <IoBookOutline size={15} />
              <span>{isSubmitting ? "Creating..." : "Create Course"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
