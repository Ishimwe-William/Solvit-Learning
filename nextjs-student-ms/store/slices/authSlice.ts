import { UserProfile } from "@/types";

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Redux action types & dummy slice functions
export const authActions = {
  setUser: (user: UserProfile | null) => ({ type: "auth/setUser", payload: user }),
  setLoading: (isLoading: boolean) => ({ type: "auth/setLoading", payload: isLoading }),
  setError: (error: string | null) => ({ type: "auth/setError", payload: error }),
  logout: () => ({ type: "auth/logout" }),
};
