import { UserProfile } from "@/types";

export interface StudentState {
  students: UserProfile[];
  pendingApprovals: UserProfile[];
  isLoading: boolean;
  error: string | null;
}

export const initialStudentState: StudentState = {
  students: [],
  pendingApprovals: [],
  isLoading: false,
  error: null,
};

export const studentActions = {
  setStudents: (students: UserProfile[]) => ({ type: "student/setStudents", payload: students }),
  addStudent: (student: UserProfile) => ({ type: "student/addStudent", payload: student }),
  setPendingApprovals: (pending: UserProfile[]) => ({ type: "student/setPendingApprovals", payload: pending }),
  approveStudent: (id: string) => ({ type: "student/approveStudent", payload: id }),
};
