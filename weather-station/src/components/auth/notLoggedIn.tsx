import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { WiDaySunny } from "react-icons/wi";
import { FaLock, FaUserPlus, FaSignInAlt } from "react-icons/fa";

interface NotLoggedInProps {
    title?: string;
    description?: string;
}

export const NotLoggedIn = ({
    title = "Welcome to Bunsen Weather",
    description = "Please log in or create an account to access live weather forecasts, search locations, and view detailed atmospheric conditions.",
}: NotLoggedInProps) => {
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center gap-6 text-white">
            {/* Glass Icon Badge */}
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/30 border border-white/30 shadow-lg">
                <WiDaySunny className="text-5xl text-amber-300 animate-pulse" />
                <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-md">
                    <FaLock className="text-xs" />
                </div>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                    {title}
                </h2>
                <p className="text-sm text-white/75 font-light leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-3 pt-2">
                <Button
                    variant="filled"
                    fullWidth
                    leftIcon={<FaSignInAlt />}
                    action={() => navigate("/login")}
                >
                    Log In
                </Button>
                <Button
                    variant="outlined"
                    fullWidth
                    leftIcon={<FaUserPlus />}
                    action={() => navigate("/register")}
                >
                    Create an Account
                </Button>
            </div>
        </div>
    );
};
