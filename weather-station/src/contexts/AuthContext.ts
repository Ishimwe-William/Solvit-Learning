import {createContext} from "react";
import type {UserType} from "../types/user.ts";

export interface AuthContextType {
    user: UserType | null;
    error: string | null;
    isAuthenticated?: boolean;
    isLoading?: boolean;
    login: (email?: string, password?: string) => Promise<void>;
    register: (email?: string, password?: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithGithub: () => Promise<void>;
    logout: () => Promise<void>;
}

// Allow the context to be undefined initially
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
