import styled from "styled-components";
import { Link } from "react-router-dom";

const colors = {
  light: {
    background: "rgba(255, 255, 255, 0.92)",
    text: "#1a202c",
    border: "#e2e8f0",
    linkBg: "#f1f5f9",
    linkHoverBg: "#e2e8f0",
    linkText: "#475569",
    activeBg: "#2563eb",
    activeText: "#ffffff",
    shadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  dark: {
    background: "rgba(30, 41, 59, 0.92)",
    text: "#f8fafc",
    border: "#334155",
    linkBg: "#0f172a",
    linkHoverBg: "#334155",
    linkText: "#cbd5e1",
    activeBg: "#4285f4",
    activeText: "#ffffff",
    shadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  },
} as const;

type ThemeMode = "light" | "dark";

export const HeaderContainer = styled.header<{ $mode?: ThemeMode }>`
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1.5rem;
  background-color: ${({ $mode = "dark" }) => colors[$mode].background};
  color: ${({ $mode = "dark" }) => colors[$mode].text};
  border-bottom: 1px solid ${({ $mode = "dark" }) => colors[$mode].border};
  box-shadow: ${({ $mode = "dark" }) => colors[$mode].shadow};
  transition: background-color 0.3s ease, border-color 0.3s ease;
  flex-wrap: wrap;
  gap: 0.75rem;

  @media (max-width: 640px) {
    padding: 0.65rem 0.85rem;
  }
`;

export const TitleLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  h1 {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.5px;
    color: inherit;
    transition: opacity 0.2s ease;

    @media (max-width: 640px) {
      font-size: 1.1rem;
    }

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }

  &:hover h1 {
    opacity: 0.85;
  }
`;

export const HeaderLeftWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

export const NavWrapper = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  @media (max-width: 480px) {
    gap: 0.4rem;
  }
`;

export const NavLink = styled(Link)<{ $mode?: ThemeMode; $isActive?: boolean }>`
  color: ${({ $mode = "dark", $isActive }) =>
    $isActive ? colors[$mode].activeText : colors[$mode].linkText};
  background-color: ${({ $mode = "dark", $isActive }) =>
    $isActive ? colors[$mode].activeBg : colors[$mode].linkBg};
  border: 1px solid
    ${({ $mode = "dark", $isActive }) =>
      $isActive ? colors[$mode].activeBg : colors[$mode].border};
  padding: 0.45rem 1rem;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.25s ease;
  box-shadow: ${({ $isActive }) =>
    $isActive ? "0 2px 8px rgba(66, 133, 244, 0.35)" : "none"};

  @media (max-width: 480px) {
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
  }

  &:hover {
    background-color: ${({ $mode = "dark", $isActive }) =>
      $isActive ? colors[$mode].activeBg : colors[$mode].linkHoverBg};
    border-color: #4285f4;
    color: ${({ $isActive }) => ($isActive ? "#ffffff" : "#4285f4")};
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(66, 133, 244, 0.2);
  }
`;