import type {ReactNode} from "react";

interface RowType {
    icon: ReactNode
    time: string;
    label: string;
    temp: number;
    valueIcon: ReactNode
}

export const ForecastRow = ({label, temp, time, valueIcon, icon}: RowType) => {
    return (
        <div className="group flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer">
            <div className="flex items-center space-x-3.5">
                <div className="text-2xl text-amber-300 group-hover:scale-110 transition-transform duration-200">
                    {icon}
                </div>
                <div className="flex flex-col text-left">
                    <span className="text-white font-medium text-sm">{time}</span>
                    <span className="text-white/60 text-xs font-light">{label}</span>
                </div>
            </div>
            <div className="flex items-baseline text-white font-semibold text-base">
                <span>{temp}</span>
                <span className="text-base font-semibold leading-none ml-0.5">{valueIcon}</span>
            </div>
        </div>
    )
}