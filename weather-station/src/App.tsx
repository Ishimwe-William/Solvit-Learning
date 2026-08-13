import './App.css'
import {WiNightCloudy} from "react-icons/wi";
import {FaRegSnowflake, FaThermometerHalf} from "react-icons/fa";
import {MdOutlineWaterDrop} from "react-icons/md";
import {BsWind} from "react-icons/bs";
import {DataRow, CurrentCityView, SearchField, ForecastRow} from "./components";
import {useState} from "react";
import {useGetWeatherDataByCityQuery} from "./service/apiSlice.ts";
import type {ErrorType} from "./types/error.ts";

function App() {
    const [city, setCity] = useState<string>("Kigali");
    const {data: weatherData, isLoading, error, isError} = useGetWeatherDataByCityQuery(city);

    const handleOnSearch = (searchCity: string) => {
        const trimmed = searchCity.trim();
        if (trimmed) {
            setCity(trimmed);
        }
    }

    const searchErrorMessage = (error as ErrorType)?.data?.error?.message;


    return (
        <div
            className="w-full relative flex flex-col md:flex-row justify-between text-white font-sans overflow-hidden gap-6"
        >
            {/* Left Section (50% left side) */}
            <div
                className="flex flex-col justify-between flex-1 relative z-10 min-h-[40vh] md:min-h-0 pb-8 md:pb-16 pl-2 sm:pl-6 md:pl-10 lg:pl-16 gap-6">


                <CurrentCityView
                    isLoading={isLoading}
                    label={weatherData?.current?.condition?.text || "Partly Cloudy"}
                    timeDate={new Date()}
                    temp={Math.round(weatherData?.current?.temp_c ?? 0)}
                    city={weatherData?.location?.name || city}
                    valueIcon="°"
                    icon={<WiNightCloudy/>}
                />
            </div>


            {/* Right Floating Glassmorphism Card */}
            <div
                className="w-full md:w-[440px] lg:w-[460px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative z-10">
                <div>
                    <SearchField placeholder="Search location..." onSearch={handleOnSearch}/>

                    {isError && (
                        <div
                            className="-mt-3 mb-4 p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-200 text-xs flex items-center justify-between backdrop-blur-sm">
                            <span>{searchErrorMessage || "No matching location found. Please try another city."}</span>
                        </div>
                    )}

                    {/* Weather Details Section */}
                    <div className="mt-6">
                        <h2 className="text-white/90 font-medium text-xs tracking-widest uppercase mb-1">
                            Weather Details...
                        </h2>
                        {isLoading ? (
                            <div className="space-y-2 mt-3 animate-pulse">
                                <div className="h-4 w-24 bg-white/20 rounded mb-4"/>
                                <div className="h-10 bg-white/20 rounded-xl"/>
                                <div className="h-10 bg-white/20 rounded-xl"/>
                                <div className="h-10 bg-white/20 rounded-xl"/>
                                <div className="h-10 bg-white/20 rounded-xl"/>
                                <div className="h-10 bg-white/20 rounded-xl"/>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-white/70 text-xs italic mb-4 font-light capitalize">
                                    {weatherData?.current?.condition?.text}
                                </h3>

                                <div className="space-y-1">
                                    <DataRow label="Temp Max" value={Math.round(weatherData?.current?.temp_c ?? 36)}
                                             valueIcon="°" icon={<FaThermometerHalf className="text-rose-400"/>}/>
                                    <DataRow label="Temp Min"
                                             value={Math.round(weatherData?.current?.feelslike_c ?? 28)}
                                             valueIcon="°" icon={<FaThermometerHalf className="text-sky-400"/>}/>
                                    <DataRow label="Humidity" value={weatherData?.current?.humidity ?? 0} valueIcon="%"
                                             icon={<MdOutlineWaterDrop className="text-blue-300"/>}/>
                                    <DataRow label="Cloudiness" value={weatherData?.current?.cloud ?? 0} valueIcon="%"
                                             icon={<WiNightCloudy className="text-slate-200"/>}/>
                                    <DataRow label="Wind" value={Math.round(weatherData?.current?.wind_kph ?? 0)}
                                             valueIcon="km/h" icon={<BsWind className="text-teal-300"/>}/>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="my-6 border-t border-white/15"/>

                    {/* Forecast Section */}
                    <div>
                        <h2 className="text-white/90 font-medium text-xs tracking-widest uppercase mb-3">
                            Today’s Weather Forecast...
                        </h2>
                        <div className="space-y-1">
                            <ForecastRow label="Sunny" time="09:00" temp={24} valueIcon="°" icon={<WiNightCloudy/>}/>
                            <ForecastRow label="Light Rain" time="12:00" temp={28} valueIcon="°"
                                         icon={<MdOutlineWaterDrop/>}/>
                            <ForecastRow label="Snow" time="15:00" temp={12} valueIcon="°" icon={<FaRegSnowflake/>}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default App
