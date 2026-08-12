import type {ReactNode} from "react";

interface RowType {
    label: string;
    value: number;
    valueIcon: ReactNode
    icon: ReactNode
}

export const DataRow = ({label, value, valueIcon, icon}: RowType) => {
    return (
        <div className="group flex items-center justify-between py-3.5 px-3 rounded-xl border-b border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer">
            <span className="text-white/70 text-sm font-light group-hover:text-white transition-colors duration-200">
                {label}
            </span>
            <div className="flex items-center space-x-3">
                <div className="flex items-baseline text-white font-medium text-base">
                    <span>{value}</span>
                    <span className="text-base font-medium leading-none ml-0.5">{valueIcon}</span>
                </div>
                <div className="text-xl group-hover:scale-110 transition-transform duration-200">
                    {icon}
                </div>
            </div>
        </div>
    )
}