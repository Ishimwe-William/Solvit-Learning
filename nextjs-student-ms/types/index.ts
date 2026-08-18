export type UserRole = "student" | "teacher" | "admin";
export type UserStatus = "pending" | "approved" | "suspended" | "rejected";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  created_at: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  teacher_id?: string;
  created_at?: string;
  enrolled_count?: number;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  student_id: string;
  status: "active" | "completed" | "dropped";
  enrolled_at: string;
  student?: UserProfile;
  course?: Course;
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRecord {
  id: string;
  course_id: string;
  student_id: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  marked_by?: string;
  created_at?: string;
  student?: UserProfile;
  course?: Course;
}

export type LeaveType = "sick" | "personal" | "emergency";
export type LeaveStatus = "pending" | "approved" | "rejected";

export interface LeaveRequest {
  id: string;
  student_id: string;
  course_id?: string;
  type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  review_remarks?: string;
  created_at: string;
  student?: UserProfile;
  course?: Course;
}

export interface AttendanceStats {
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendancePercentage: number;
  approvedLeaves: number;
}

export interface EmailObject {
  to: string;
  subject: string;
  htmlData: string;
  appName?: string;
}
