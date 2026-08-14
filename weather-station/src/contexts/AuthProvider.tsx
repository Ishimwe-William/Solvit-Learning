import {type ReactNode, useEffect, useState} from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup
} from "firebase/auth"
import {auth} from "../config/firebaseConfig.ts";
import type {UserType} from "../types/user.ts";
import {AuthContext} from "./AuthContext.ts";

interface ContainerProps {
    children: ReactNode;
}

export const AuthProvider = ({children}: ContainerProps) => {
    const [user, setUser] = useState<UserType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false)
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async (email?: string, password?: string) => {
        if (!email || !password) return;

        try {
            setIsLoading(true);
            setError(null);
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (email?: string, password?: string) => {
        if (!email || !password) return;

        try {
            setIsLoading(true);
            setError(null);
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = async () => {
        await signOut(auth);
        setError("");
        setUser(null)
    }

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider)
        } catch (err: unknown) {
            setError((err as Error).message);
        }
    }

    const handleGithugLogin = async () => {

        try {
            const provider = new GithubAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (err: unknown) {
            setError((err as Error).message);
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            error,
            login: handleLogin,
            register: handleRegister,
            loginWithGoogle: handleGoogleLogin,
            loginWithGithub: handleGithugLogin,
            logout: handleLogout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}
