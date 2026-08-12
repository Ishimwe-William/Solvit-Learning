import bgImage from './assets/bg-weather.png'
import logo from './assets/logo.svg'
import './App.css'
import {WiNightCloudy} from "react-icons/wi";
import {FaRegSnowflake, FaThermometerHalf} from "react-icons/fa";
import {MdOutlineWaterDrop} from "react-icons/md";
import {BsWind} from "react-icons/bs";
import {DataRow, CurrentCityView, SearchField, ForecastRow} from "./components";
import {WeatherData} from "./constants/data.ts";
import {useEffect, useState} from "react";
import type {WeatherDataType} from "./types/weatherTypes.ts";

function App() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [weatherData, setWeatherData] = useState<WeatherDataType | null>(null)
    const [city, setCity] = useState<string>("Kigali");
    const api_base_url = import.meta.env.VITE_WEATHER_BASE_URL;
    const api_key = import.meta.env.VITE_WEATHER_API_KEY;


    const activeData = weatherData || WeatherData;

    const handleOnSearch = (searchCity: string) => {
        setCity(searchCity);
    }

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                setIsLoading(true);
                const primaryUrl = `/api-weather/current.json?key=${api_key}&q=${city}`;
                let response = await fetch(primaryUrl);

                if (!response.ok) {
                    // Fallback to direct URL if needed
                    response = await fetch(`${api_base_url}/current.json?key=${api_key}&q=${city}`);
                }

                const data = await response.json();

                if (data && !data.error) {
                    setWeatherData(data);
                }
            } catch (error) {
                console.log("Proxy fetch failed, attempting direct fetch:", error);
                try {
                    const directResponse = await fetch(`${api_base_url}/current.json?key=${api_key}&q=${city}`);
                    const data = await directResponse.json();
                    console.log("Fetched Weather Data (Direct):", data);
                    if (data && !data.error) {
                        setWeatherData(data);
                    }
                } catch (directErr) {
                    console.error("Failed to fetch weather data:", directErr);
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchWeatherData();
    }, [city]);

    return (
        <div
            className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col md:flex-row justify-between text-white font-sans overflow-hidden p-4 md:p-6 lg:p-8 gap-6"
            style={{
                backgroundImage: `url(${bgImage})`
            }}>
            {/* Soft dark overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/60 pointer-events-none" />

            {/* Left Hero Section */}
            <div className="flex flex-col justify-between flex-1 relative z-10 min-h-[40vh] md:min-h-0 pb-8 md:pb-16 pl-4 sm:pl-10 md:pl-16 lg:pl-24">
                <div className="pt-2 md:pt-4">
                    <img className="h-10 md:h-12 w-auto drop-shadow-md hover:opacity-90 transition-opacity" src={logo} alt="the-weather-station-logo"/>
                </div>

                <CurrentCityView
                    isLoading={isLoading}
                    label={activeData.current?.condition?.text || "Partly Cloudy"} 
                    timeDate={new Date()} 
                    temp={Math.round(activeData.current?.temp_c ?? 0)} 
                    city={activeData.location?.name || city} 
                    valueIcon="°"
                    icon={<WiNightCloudy />}
                />
            </div>

            {/* Right Floating Glassmorphism Card */}
            <div className="w-full md:w-[440px] lg:w-[460px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative z-10">
                <div>
                    <SearchField placeholder="Search location..." onSearch={handleOnSearch} />

                    {/* Weather Details Section */}
                    <div className="mt-6">
                        <h2 className="text-white/90 font-medium text-xs tracking-widest uppercase mb-1">
                            Weather Details...
                        </h2>
                        <h3 className="text-white/70 text-xs italic mb-4 font-light capitalize">
                            {activeData.current?.condition?.text}
                        </h3>

                        <div className="space-y-1">
                            <DataRow label="Temp Max" value={Math.round(activeData.current?.temp_c ?? 36)} valueIcon="°" icon={<FaThermometerHalf className="text-rose-400" />} />
                            <DataRow label="Temp Min" value={Math.round(activeData.current?.feelslike_c ?? 28)} valueIcon="°" icon={<FaThermometerHalf className="text-sky-400" />} />
                            <DataRow label="Humidity" value={activeData.current?.humidity ?? 0} valueIcon="%" icon={<MdOutlineWaterDrop className="text-blue-300" />} />
                            <DataRow label="Cloudiness" value={activeData.current?.cloud ?? 0} valueIcon="%" icon={<WiNightCloudy className="text-slate-200" />} />
                            <DataRow label="Wind" value={Math.round(activeData.current?.wind_kph ?? 0)} valueIcon="km/h" icon={<BsWind className="text-teal-300" />} />
                        </div>
                    </div>

                    <div className="my-6 border-t border-white/15" />

                    {/* Forecast Section */}
                    <div>
                        <h2 className="text-white/90 font-medium text-xs tracking-widest uppercase mb-3">
                            Today’s Weather Forecast...
                        </h2>
                        <div className="space-y-1">
                            <ForecastRow label="Sunny" time="09:00" temp={24} valueIcon="°" icon={<WiNightCloudy />} />
                            <ForecastRow label="Light Rain" time="12:00" temp={28} valueIcon="°" icon={<MdOutlineWaterDrop />} />
                            <ForecastRow label="Snow" time="15:00" temp={12} valueIcon="°" icon={<FaRegSnowflake />} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
