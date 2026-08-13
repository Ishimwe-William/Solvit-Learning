import {Button} from "../ui/button";
import {FaGithub, FaGoogle} from "react-icons/fa";
import {useNavigate} from "react-router-dom";

interface LoginReg {
    isLogin: boolean;
    handleLogin?: () => void;
    handleRegister?: () => void;
    handleCancel?: () => void;
}

export const LoginRegister = ({isLogin = true, handleLogin, handleRegister}: LoginReg) => {
    const navigate = useNavigate();

    return (
        <div
            className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-4 text-white">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 text-sm outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 transition-all duration-200"
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 text-sm outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 transition-all duration-200"
                />
                <input
                    type="password"
                    placeholder="Confirm your password"
                    className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 text-sm outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 transition-all duration-200 ${isLogin ? "hidden" : "block"}`}
                />
                <div className="flex flex-col gap-2 mt-1">
                    <Button
                        type="submit"
                        variant="filled"
                        fullWidth
                        label={isLogin ? "Login" : "Register"}
                        action={isLogin ? handleLogin : handleRegister}
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
                <Button variant="outlined" fullWidth label="Continue With Google" leftIcon={<FaGoogle/>}/>
                <Button variant="outlined" fullWidth label="Continue With Github" leftIcon={<FaGithub/>}/>
            </div>
        </div>
    )
}
