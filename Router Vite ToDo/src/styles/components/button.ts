import styled, { css, keyframes } from "styled-components";
import { Link } from "react-router-dom";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "text"
  | "link"
  | "danger"
  | "success";

export type ButtonSize = "sm" | "md" | "lg";

type BaseButtonProps = {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
  $isLoading?: boolean;
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Spinner = styled.span<{ $size?: ButtonSize }>`
  display: inline-block;
  width: ${({ $size = "md" }) => ($size === "sm" ? "12px" : $size === "lg" ? "18px" : "14px")};
  height: ${({ $size = "md" }) => ($size === "sm" ? "12px" : $size === "lg" ? "18px" : "14px")};
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
`;

// Size presets
const sizeStyles = {
  sm: css`
    padding: 0.35rem 0.75rem;
    font-size: 0.85rem;
    border-radius: 6px;
  `,
  md: css`
    padding: 0.55rem 1.25rem;
    font-size: 0.925rem;
    border-radius: 8px;
  `,
  lg: css`
    padding: 0.75rem 1.75rem;
    font-size: 1.05rem;
    border-radius: 10px;
  `,
};

// Variant presets
const variantStyles = {
  primary: css`
    background: linear-gradient(135deg, #4285f4, #2563eb);
    color: #ffffff;
    border: 1px solid transparent;
    box-shadow: 0 4px 12px rgba(66, 133, 244, 0.25);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(66, 133, 244, 0.35);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,

  secondary: css`
    background-color: var(--code-bg, #1e293b);
    color: var(--text-h, #f8fafc);
    border: 1px solid var(--border, #334155);

    &:hover:not(:disabled) {
      background-color: var(--border, #334155);
      color: #ffffff;
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,

  outline: css`
    background-color: transparent;
    color: #4285f4;
    border: 1.5px solid #4285f4;

    &:hover:not(:disabled) {
      background-color: rgba(66, 133, 244, 0.1);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,

  text: css`
    background-color: transparent;
    color: var(--text, #cbd5e1);
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.08);
      color: var(--text-h, #ffffff);
    }
  `,

  link: css`
    background: none;
    color: #4285f4;
    border: none;
    padding: 0;
    box-shadow: none;
    text-decoration: none;

    &:hover:not(:disabled) {
      text-decoration: underline;
      color: #60a5fa;
    }
  `,

  danger: css`
    background: linear-gradient(135deg, #ea4335, #dc2626);
    color: #ffffff;
    border: 1px solid transparent;
    box-shadow: 0 4px 12px rgba(234, 67, 53, 0.25);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(234, 67, 53, 0.35);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,

  success: css`
    background: linear-gradient(135deg, #34a853, #16a34a);
    color: #ffffff;
    border: 1px solid transparent;
    box-shadow: 0 4px 12px rgba(52, 168, 83, 0.25);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #16a34a, #15803d);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(52, 168, 83, 0.35);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
};

// Base reusable CSS for both <button> and <Link>
const commonButtonStyles = css<BaseButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};

  ${({ $size = "md" }) => sizeStyles[$size]}
  ${({ $variant = "primary" }) => variantStyles[$variant]}

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

export const StyledButton = styled.button<BaseButtonProps>`
  ${commonButtonStyles}
`;

export const StyledLink = styled(Link)<BaseButtonProps>`
  ${commonButtonStyles}
`;