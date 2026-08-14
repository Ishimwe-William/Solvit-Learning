import React, { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariants = "filled" | "outlined" | "link" | "icon" | "ghost" | "danger";
export type ButtonSizes = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    action?: () => void;
    label?: string;
    variant?: ButtonVariants;
    size?: ButtonSizes;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    isLoading?: boolean;
    fullWidth?: boolean;
    children?: ReactNode;
}

const variantStyles: Record<ButtonVariants, string> = {
    filled: "bg-white/20 hover:bg-white/30 active:bg-white/40 text-white backdrop-blur-md border border-white/20 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-white/50",
    outlined: "border border-white/40 hover:border-white text-white hover:bg-white/10 active:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/50",
    link: "text-white/80 hover:text-white underline-offset-4 hover:underline p-0 bg-transparent focus-visible:ring-2 focus-visible:ring-white/50",
    icon: "bg-white/10 hover:bg-white/20 active:bg-white/30 text-white backdrop-blur-md border border-white/20 focus-visible:ring-2 focus-visible:ring-white/50 aspect-square p-2.5",
    ghost: "bg-transparent hover:bg-white/10 active:bg-white/20 text-white focus-visible:ring-2 focus-visible:ring-white/50",
    danger: "bg-rose-600/80 hover:bg-rose-600 active:bg-rose-700 text-white border border-rose-500/30 shadow-md focus-visible:ring-2 focus-visible:ring-rose-400",
};

const sizeStyles: Record<ButtonSizes, string> = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5 font-medium",
    md: "px-4 py-2 text-sm rounded-xl gap-2 font-medium",
    lg: "px-5 py-2.5 text-base rounded-2xl gap-2.5 font-semibold",
};

const iconSizeStyles: Record<ButtonSizes, string> = {
    sm: "p-1.5 rounded-lg text-xs",
    md: "p-2.5 rounded-xl text-sm",
    lg: "p-3.5 rounded-2xl text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            action,
            label,
            children,
            variant = "filled",
            size = "md",
            leftIcon,
            rightIcon,
            isLoading = false,
            fullWidth = false,
            disabled,
            onClick,
            className = "",
            type = "button",
            ...props
        },
        ref
    ) => {
        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (disabled || isLoading) return;
            if (onClick) onClick(e);
            if (action) action();
        };

        const isIconVariant = variant === "icon";

        const baseClasses =
            "inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]";

        const widthClasses = fullWidth ? "w-full" : "";
        const variantClass = variantStyles[variant] || variantStyles.filled;
        const sizeClass = isIconVariant ? iconSizeStyles[size] : sizeStyles[size];

        const content = children || label;

        return (
            <button
                ref={ref}
                type={type}
                onClick={handleClick}
                disabled={disabled || isLoading}
                aria-busy={isLoading}
                aria-label={typeof content === "string" ? content : label || "Button"}
                className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClasses} ${className}`.trim()}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin -ml-0.5 h-4 w-4 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}

                {!isLoading && leftIcon && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>}

                {content && <span className={isIconVariant ? "sr-only" : ""}>{content}</span>}

                {!isLoading && rightIcon && <span className="inline-flex shrink-0 items-center">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = "Button";
