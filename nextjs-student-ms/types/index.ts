export type UserRole = "member" | "manager" | "admin" | "user";
export type UserStatus = "pending" | "approved" | "suspended";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName?: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  markedBy?: string;
}

export type LeaveType = "sick" | "personal" | "emergency";
export type LeaveStatus = "pending" | "approved" | "rejected";

export interface LeaveRequest {
  id: string;
  userId: string;
  userName?: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  reviewedBy?: string;
  reviewRemarks?: string;
  createdAt: string;
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
