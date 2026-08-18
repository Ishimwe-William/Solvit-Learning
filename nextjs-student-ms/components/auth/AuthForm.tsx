"use client";

import React, {SubmitEventHandler, useState, useTransition} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/Button";
import {loginWithEmail, loginWithGoogle, studentRegister} from "@/app/(auth)/actions";
import {useSearchParams} from "next/navigation";

interface AuthFormProps {
    initialMode?: "signin" | "signup";
}

export function AuthForm({initialMode = "signin"}: AuthFormProps) {
    const [mode, setMode] = useState<"signin" | "signup">(initialMode);
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error");

    const displayError = error || urlError;

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setError(null)

        const formData = new FormData(e.currentTarget)

        startTransition(async () => {
            try {
                if (mode === "signin") {
                    await loginWithEmail(formData);
                } else {
                    await studentRegister(formData);
                }
            } catch (err: any) {
                if (err?.message?.includes("NEXT_REDIRECT") || err?.digest?.includes("NEXT_REDIRECT")) return;
                setError("An absolute system connection failure occurred. Please try again.");
            }
        })
    };

    const handleGoogleLogin = async () => {
        setError(null)
        startTransition(async () => {
            try {
                await loginWithGoogle()
            } catch (err: any) {
                if (err?.message?.includes("NEXT_REDIRECT") || err?.digest?.includes("NEXT_REDIRECT")) return;
                setError("Could not complete Google OAuth routing.");
            }
        })
    }

    return (
        <div className="w-full space-y-6">
            <div className="text-center">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {mode === "signin" ? "Welcome Back" : "Create an Account"}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                    {mode === "signin"
                        ? "Enter your credentials or continue with a provider"
                        : "Sign up with your email or social provider"}
                </p>
            </div>

            {/* Error Banner */}
            {displayError && (
                <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
                    {displayError}
                </div>
            )}

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                    <div>
                        <label className="block text-xs font-medium text-foreground mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name={"fullName"}
                            placeholder="e.g. Alex Morgan"
                            required
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name={"email"}
                        placeholder="name@example.com"
                        required
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-foreground">
                            Password
                        </label>
                        {mode === "signin" && (
                            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    <input
                        type="password"
                        name={"password"}
                        placeholder="••••••••"
                        required
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-2.5 text-sm"
                    disabled={isPending}
                >
                    {isPending
                        ? "Processing..."
                        : mode === "signin"
                            ? "Sign In"
                            : "Create Account"}
                </Button>
            </form>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"/>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-medium">Or continue with</span>
                </div>
            </div>

            {/* OAuth Provider Button */}
            <Button
                type="button"
                disabled={isPending}
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-2.5"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                </svg>
                <span>Continue with Google</span>
            </Button>

            {/* Switch Helper */}
            <div className="text-center text-xs text-muted-foreground pt-1">
                {mode === "signin" ? (
                    <p>
                        Don&apos;t have an account yet?{" "}
                        <button
                            type="button"
                            onClick={() => {
                                setError(null);
                                setMode("signup");
                            }}
                            className="font-semibold text-primary hover:underline cursor-pointer"
                        >
                            Sign up
                        </button>
                    </p>
                ) : (
                    <p>
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() => {
                                setError(null);
                                setMode("signin");
                            }}
                            className="font-semibold text-primary hover:underline cursor-pointer"
                        >
                            Sign in
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
}
