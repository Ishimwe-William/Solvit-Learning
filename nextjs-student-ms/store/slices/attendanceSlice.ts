import { AttendanceRecord, AttendanceStats } from "@/types";

export interface AttendanceState {
  records: AttendanceRecord[];
  stats: AttendanceStats | null;
  selectedDate: string;
  isLoading: boolean;
  error: string | null;
}

export const initialAttendanceState: AttendanceState = {
  records: [],
  stats: null,
  selectedDate: new Date().toISOString().split("T")[0],
  isLoading: false,
  error: null,
};

export const attendanceActions = {
  setRecords: (records: AttendanceRecord[]) => ({ type: "attendance/setRecords", payload: records }),
  addRecord: (record: AttendanceRecord) => ({ type: "attendance/addRecord", payload: record }),
  setSelectedDate: (date: string) => ({ type: "attendance/setSelectedDate", payload: date }),
  setStats: (stats: AttendanceStats) => ({ type: "attendance/setStats", payload: stats }),
};
