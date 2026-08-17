import { initialAuthState, AuthState } from "./slices/authSlice";
import { initialAttendanceState, AttendanceState } from "./slices/attendanceSlice";
import { initialLeaveState, LeaveState } from "./slices/leaveSlice";
import { initialStudentState, StudentState } from "./slices/studentSlice";

export interface RootState {
  auth: AuthState;
  attendance: AttendanceState;
  leave: LeaveState;
  student: StudentState;
}

export const initialRootState: RootState = {
  auth: initialAuthState,
  attendance: initialAttendanceState,
  leave: initialLeaveState,
  student: initialStudentState,
};

export const store = {
  getState: (): RootState => initialRootState,
  dispatch: (action: any) => action,
  subscribe: (listener: () => void) => () => {},
};

export type AppDispatch = typeof store.dispatch;
