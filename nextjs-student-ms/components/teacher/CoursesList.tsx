"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { AddCourseModal } from "@/components/teacher/AddCourseModal";
import { Course } from "@/types";
import { IoBookOutline, IoPeopleOutline, IoArrowForwardOutline, IoAddOutline } from "react-icons/io5";

interface CoursesListProps {
  initialCourses: (Course & { enrollments_count: number })[];
}

export function CoursesList({ initialCourses = [] }: CoursesListProps) {
  const [courses, setCourses] = useState(initialCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCourseCreated = (newCourse: any) => {
    setCourses((prev) => [{ ...newCourse, enrollments_count: 0 }, ...prev]);
  };

  return (
    <>
      <DashboardHeader
        heading="Course Management"
        text="Manage academic courses, syllabus tracks, and enrolled student rosters."
      >
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto gap-2"
        >
          <IoAddOutline size={18} />
          <span>Add New Course</span>
        </Button>
      </DashboardHeader>

      {courses.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <IoBookOutline size={24} />
          </div>
          <h3 className="text-base font-bold text-foreground">No Courses Created Yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Get started by adding your first academic course offering to track attendance and leaves.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 gap-1.5"
          >
            <IoAddOutline size={16} />
            <span>Create First Course</span>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="p-5 flex flex-col justify-between hover:border-primary/50 transition-all shadow-xs hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary font-mono text-xs font-bold uppercase tracking-wider">
                    {course.code}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    <IoPeopleOutline size={16} />
                    <span>{course.enrollments_count} Students</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-foreground leading-snug">
                  {course.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                  {course.description || "No description provided for this course."}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
                <Link
                  href={`/teacher/courses/${course.id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                >
                  <span>Manage Roster & Attendance</span>
                  <IoArrowForwardOutline size={14} />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCourseCreated={handleCourseCreated}
      />
    </>
  );
}
