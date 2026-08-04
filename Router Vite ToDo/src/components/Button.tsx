import type { ReactNode, ButtonHTMLAttributes } from "react";
import {
  StyledButton,
  StyledLink,
  Spinner,
  type ButtonSize,
  type ButtonVariant,
} from "../styles/components/button";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  to?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const Button = ({
  children,
  to,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  type = "button",
  disabled = false,
  onClick,
  ...props
}: ButtonProps) => {
  const content = (
    <>
      {isLoading ? (
        <Spinner $size={size} />
      ) : (
        leftIcon && <span style={{ display: "inline-flex", alignItems: "center" }}>{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span style={{ display: "inline-flex", alignItems: "center" }}>{rightIcon}</span>
      )}
    </>
  );

  if (to) {
    return (
      <StyledLink
        to={to}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        onClick={onClick}
      >
        {content}
      </StyledLink>
    );
  }

  return (
    <StyledButton
      type={type}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $isLoading={isLoading}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {content}
    </StyledButton>
  );
};