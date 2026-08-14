import {Button} from "../ui/button";
import logo from "../../assets/logo.svg";
import {IoPersonCircle} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.ts";

export const Navbar = () => {
    const {user, isAuthenticated, logout} = useAuth();

    const displayName = user?.displayName || user?.email?.split("@")[0] || "User Profile"

    const navigate = useNavigate();

    const handleProfile = () => {
        console.log("handleProfile")
    }

    return (
        <div
            className="w-full relative z-50 flex items-center justify-between p-4 md:px-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
                <div>
                    <img className="h-10 md:h-12 w-auto drop-shadow-md hover:opacity-90 transition-opacity" src={logo}
                         alt="the-weather-station-logo"/>
                </div>
                <div>
                    <Button action={() => navigate("/")} label="BunsenPlus" variant="filled">
                        <h1 className="text-lg md:text-xl font-light text-white">BunsenWeather</h1>
                    </Button>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {isAuthenticated ? (
                    <>
                        <Button variant="link" action={logout}>Logout</Button>
                        <Button variant="link" rightIcon={<IoPersonCircle size={24}/>} action={handleProfile}>
                            <span>{displayName}</span>
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="link" action={() => navigate("/login")}>Login</Button>
                        <Button variant="link" action={() => navigate("/register")}>SignUp</Button>
                    </>
                )}
            </div>
        </div>
    );
};

