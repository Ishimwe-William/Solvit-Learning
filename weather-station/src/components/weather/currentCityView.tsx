import type {ReactNode} from "react";

interface CurrentCityViewProps {
    label?: string;
    city: string;
    timeDate: Date;
    icon: ReactNode;
    valueIcon: ReactNode;
    temp: number;
    isLoading: boolean;
}

export const CurrentCityView = ({temp, city, timeDate, icon, valueIcon, isLoading}: CurrentCityViewProps) => {

    const formatTimeDate = (timeDate: Date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[timeDate.getDay()];

        const hours = String(timeDate.getHours()).padStart(2, '0');
        const minutes = String(timeDate.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        const day = String(timeDate.getDate()).padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = months[timeDate.getMonth()];
        const year = String(timeDate.getFullYear()).slice(-2);

        return (
            <div className="flex flex-wrap items-center gap-x-2 text-white/80 text-sm md:text-base font-light">
                <span>{timeString}</span>
                <span>-</span>
                <span>{dayName}, {day} {monthName} '{year}</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6 py-4 md:py-8 z-10">
            {isLoading ? (
                <>
                    <p>Loading...</p>
                </>
            ) : (
                <>
                    <div className="flex items-start">
                <span
                    className="text-7xl sm:text-8xl md:text-9xl font-extralight tracking-tighter text-white drop-shadow-lg leading-none">
                    {temp}
                </span>
                        <span
                            className="text-5xl sm:text-6xl md:text-7xl text-white/90 font-extralight drop-shadow-md leading-none self-start -mt-2">
                    {valueIcon}
                </span>
                    </div>

                    <div className="flex flex-col space-y-1 mb-1">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-wide text-white drop-shadow-md">
                                {city}
                            </h1>
                            <div className="text-3xl sm:text-4xl md:text-5xl text-white/90 drop-shadow">
                                {icon}
                            </div>
                        </div>
                        {formatTimeDate(timeDate)}
                    </div>
                </>
            )}

        </div>
    )
}