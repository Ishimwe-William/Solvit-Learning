import { useRouteError, useNavigate } from "react-router-dom";
import type { ExceptionPageProps, ErrorType } from "../../types/error.ts";
import { Button } from "../ui/button";
import { FaExclamationTriangle, FaHome, FaRedo } from "react-icons/fa";

export const ExceptionPage = ({ error: propError }: ExceptionPageProps) => {
    const routeError = useRouteError() as (Error & { statusText?: string; status?: number }) | null;
    const navigate = useNavigate();

    const activeError = propError || routeError;

    let errorMessage = "An unexpected error occurred. Please try again.";
    let errorCode: string | number | undefined;

    if (activeError) {
        if (typeof activeError === "string") {
            errorMessage = activeError;
        } else if (activeError instanceof Error) {
            errorMessage = activeError.message;
        } else if (typeof activeError === "object") {
            const errObj = activeError as ErrorType & { statusText?: string; message?: string };
            errorCode = errObj.status || errObj.data?.error?.code;
            errorMessage =
                errObj.data?.error?.message ||
                errObj.message ||
                errObj.statusText ||
                (typeof errObj.error === "string" ? errObj.error : errorMessage);
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 text-white">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl flex flex-col items-center gap-6">
                {/* Warning Icon Badge */}
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 shadow-md">
                    <FaExclamationTriangle className="text-3xl" />
                </div>

                {/* Title & Message */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Something Went Wrong
                    </h2>
                    {errorCode && (
                        <span className="text-xs font-mono text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 inline-block self-center">
                            Code: {errorCode}
                        </span>
                    )}
                    <p className="text-sm text-white/80 font-light mt-1 leading-relaxed">
                        {errorMessage}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                        variant="outlined"
                        fullWidth
                        leftIcon={<FaRedo />}
                        action={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                    <Button
                        variant="filled"
                        fullWidth
                        leftIcon={<FaHome />}
                        action={() => navigate("/")}
                    >
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

