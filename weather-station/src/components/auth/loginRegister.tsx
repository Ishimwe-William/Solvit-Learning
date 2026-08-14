import {Button} from "../ui/button";
import {FaGithub, FaGoogle} from "react-icons/fa";
import {Navigate, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.ts";
import {type SubmitEventHandler, useState} from "react";

interface LoginReg {
    isLogin: boolean;
}

interface AuthInfo {
    email: string;
    password: string;
    confirmPassword?: string;
}

export const LoginRegister = ({isLogin = true}: LoginReg) => {
    const navigate = useNavigate();
    const {isAuthenticated, login, register, loginWithGithub, loginWithGoogle, error, isLoading} = useAuth();
    const [authInfo, setAuthInfo] = useState<AuthInfo>({email: "", password: "", confirmPassword: ""});

    if(isAuthenticated) return <Navigate to={"/"}/>

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (isLogin) {
            await login(authInfo.email, authInfo.password);
        } else {
            if (authInfo.password === authInfo.confirmPassword) {
                await register(authInfo.email)
            }
            await register(authInfo.email, authInfo.password)
        }
    }

    const handleGoogle = async () => {
        await loginWithGoogle();
    }

    const handleGithub = async () => {
        await loginWithGithub();
    }

    return (
        <div
            className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-4 text-white">

            {/* Display error message if any */}
            {error && (
                <div
                    className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-200 text-xs text-center backdrop-blur-sm">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={authInfo.email}
                    name={authInfo.email}
                    required
                    onChange={(e) => setAuthInfo({...authInfo, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 text-sm outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 transition-all duration-200"
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={authInfo.password}
                    name={authInfo.password}
                    required
                    onChange={(e) => setAuthInfo({...authInfo, password: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 text-sm outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 transition-all duration-200"
                />
                <input
                    type="password"
                    placeholder="Confirm your password"
                    value={authInfo.confirmPassword}
                    name={authInfo.confirmPassword}
                    required={!isLogin}
                    onChange={(e) => setAuthInfo({...authInfo, confirmPassword: e.target.value})}
                    className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 text-sm outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 transition-all duration-200 ${isLogin ? "hidden" : "block"}`}
                />
                <div className="flex flex-col gap-2 mt-1">
                    <Button
                        type="submit"
                        variant="filled"
                        fullWidth
                        isLoading={isLoading}
                        label={isLogin ? "Login" : "Register"}
                        action={isLogin ? login : register}
                    />
                    <Button
                        variant="outlined"
                        fullWidth
                        label="Cancel"
                        action={() => navigate(-1)}
                    />
                </div>
            </form>
            <div className="flex items-center my-2 gap-3">
                <div className="flex-1 border-t border-white/20"/>
                <div
                    className="px-3 text-xs text-white/50 uppercase tracking-wider bg-white/10 backdrop-blur-md rounded-full py-0.5 shrink-0">
                    or
                </div>
                <div className="flex-1 border-t border-white/20"/>
            </div>


            <div className="flex flex-col gap-2.5">
                <Button variant="outlined" action={handleGoogle} fullWidth label="Continue With Google"
                        leftIcon={<FaGoogle/>}/>
                <Button variant="outlined" action={handleGithub} fullWidth label="Continue With Github"
                        leftIcon={<FaGithub/>}/>
            </div>
        </div>
    )
}
