import {Outlet} from "react-router-dom";
import bgImage from '../assets/bg-weather.png'
import {Navbar} from "../components";

export const Layout = () => {

    return (
        <main
            className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col p-4 md:p-6 lg:p-8 gap-6 relative overflow-x-hidden text-white"
            style={{
                backgroundImage: `url(${bgImage})`
            }}
        >
            {/* Soft dark overlay for contrast across all pages */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/60 pointer-events-none z-0" />

            <div className="w-full relative z-50">
                <Navbar/>
            </div>
            <div className="flex-1 w-full relative z-10 flex flex-col justify-center items-center">
                <Outlet/>
            </div>
        </main>
    )
}
