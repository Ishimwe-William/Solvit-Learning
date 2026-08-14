import type {ReactNode} from "react";
import {useAuth} from "../../hooks/useAuth.ts";
import {NotLoggedIn} from "./notLoggedIn.tsx";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    const {isLoading, isAuthenticated} = useAuth()

    if(isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <NotLoggedIn/>
    }
    return (
        <>{children}</>
    )
}