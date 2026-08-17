import { LeaveRequest } from "@/types";

export interface LeaveState {
  requests: LeaveRequest[];
  isLoading: boolean;
  error: string | null;
}

export const initialLeaveState: LeaveState = {
  requests: [],
  isLoading: false,
  error: null,
};

export const leaveActions = {
  setRequests: (requests: LeaveRequest[]) => ({ type: "leave/setRequests", payload: requests }),
  addRequest: (request: LeaveRequest) => ({ type: "leave/addRequest", payload: request }),
  updateStatus: (id: string, status: "approved" | "rejected", remarks?: string) => ({
    type: "leave/updateStatus",
    payload: { id, status, remarks },
  }),
};
