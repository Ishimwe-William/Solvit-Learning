import {useContext} from "react";
import {AuthContext} from "../contexts/AuthContext.ts";

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) throw new Error("Not authenticated")
    return context
}