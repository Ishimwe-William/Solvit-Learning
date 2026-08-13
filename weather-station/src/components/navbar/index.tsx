import {useState} from "react";
import {Button} from "../ui/button";
import logo from "../../assets/logo.svg";
import { IoPersonCircle } from "react-icons/io5";
import {useNavigate} from "react-router-dom";

export const Navbar = () => {
    const [isLoggedIn, setIsLogggedIn] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleProfile = () => {
        console.log("hanldeProfile")
    }

    const handleLogout = () => {
        navigate("/");
        setIsLogggedIn(false)
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
                {isLoggedIn ? (
                    <>
                        <Button variant="link" action={handleLogout}>Logout</Button>
                        <Button variant="icon" rightIcon={<IoPersonCircle size={24}/>} action={handleProfile} >Profile</Button>
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

