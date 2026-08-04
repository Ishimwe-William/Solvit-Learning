import styled, { keyframes } from "styled-components";

export const googleBlue = "#4285f4";
export const googleRed = "#ea4335";
export const googleYellow = "#fbbc05";
export const googleGreen = "#34a853";

export type LogoSize = "sm" | "md" | "lg";

const sizeStyles = {
  sm: {
    fontSize: "1rem",
    iconSize: "18px",
    borderWidth: "2px",
    gap: "8px",
  },
  md: {
    fontSize: "1.5rem",
    iconSize: "26px",
    borderWidth: "3px",
    gap: "12px",
  },
  lg: {
    fontSize: "2.2rem",
    iconSize: "36px",
    borderWidth: "4px",
    gap: "16px",
  },
}

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

export const BrandWrapper = styled.span<{ $size?: LogoSize }>`
      display: inline-flex;
      align-items: center;
      gap: ${({ $size = "md" }) => sizeStyles[$size].gap};
    `;

export const SpinningBrandIcon = styled.span<{ $size?: LogoSize }>`
      width: ${({ $size = "md" }) => sizeStyles[$size].iconSize};
      height: ${({ $size = "md" }) => sizeStyles[$size].iconSize};
      border: ${({ $size = "md" }) => sizeStyles[$size].borderWidth} solid rgba(66, 133, 244, 0.25);
      border-top: ${({ $size = "md" }) => sizeStyles[$size].borderWidth} solid ${googleBlue};
      border-right: ${({ $size = "md" }) => sizeStyles[$size].borderWidth} solid ${googleRed};
      border-bottom: ${({ $size = "md" }) => sizeStyles[$size].borderWidth} solid ${googleYellow};
      border-left: ${({ $size = "md" }) => sizeStyles[$size].borderWidth} solid ${googleGreen};
      border-radius: 50%;
      animation: ${spin} 1.5s linear infinite;
      display: inline-block;
    `;

export const BunsenplusText = styled.span<{ $size?: LogoSize }>`
      font-size: ${({ $size = "md" }) => sizeStyles[$size].fontSize};
      font-weight: 800;
      line-height: 1.2;
      display: inline-block;
      vertical-align: middle;
    
      span {
        display: inline-block;
        line-height: 1.2;
      }
    
      span:nth-child(1)  { color: ${googleBlue}; -webkit-text-fill-color: ${googleBlue}; }  /* B */
      span:nth-child(2)  { color: ${googleRed}; -webkit-text-fill-color: ${googleRed}; }   /* u */
      span:nth-child(3)  { color: ${googleYellow}; -webkit-text-fill-color: ${googleYellow}; }/* n */
      span:nth-child(4)  { color: ${googleBlue}; -webkit-text-fill-color: ${googleBlue}; }  /* s */
      span:nth-child(5)  { color: ${googleGreen}; -webkit-text-fill-color: ${googleGreen}; } /* e */
      span:nth-child(6)  { color: ${googleRed}; -webkit-text-fill-color: ${googleRed}; }   /* n */
      span:nth-child(7)  { color: ${googleBlue}; -webkit-text-fill-color: ${googleBlue}; }  /* p */
      span:nth-child(8)  { color: ${googleRed}; -webkit-text-fill-color: ${googleRed}; }   /* l */
      span:nth-child(9)  { color: ${googleYellow}; -webkit-text-fill-color: ${googleYellow}; }/* u */
      span:nth-child(10) { color: ${googleGreen}; -webkit-text-fill-color: ${googleGreen}; } /* s */
    `;
