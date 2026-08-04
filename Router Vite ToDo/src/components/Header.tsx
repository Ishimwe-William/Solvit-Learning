import { BunsenplusLogo } from "./BunsenplusLogo";
import { FaRegMoon, FaSun } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import {
  HeaderContainer,
  HeaderLeftWrapper,
  NavLink,
  TitleLink,
  NavWrapper,
} from "../styles/components/header";
import { Button } from "./Button";
import { useEffect, useState } from "react";

export const Header = () => {
  const location = useLocation();
  const [mode, setMode] = useState<"light" | "dark">(
    (document.body.getAttribute("data-theme") as "light" | "dark") || "dark"
  );

  const toggleTheme = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", newMode);
    setMode(newMode);
  };

  useEffect(() => {
    const currentMode = document.body.getAttribute("data-theme");
    if (!currentMode) {
      document.body.setAttribute("data-theme", "dark");
    }
  }, []);

  const isHomeActive =
    location.pathname === "/" ||
    location.pathname === "/tasks" ||
    location.pathname === "/home";

  return (
    <HeaderContainer $mode={mode}>
      <HeaderLeftWrapper>
        <BunsenplusLogo size="md" />
        <TitleLink to="/" aria-label="Go to Home Page">
          <h1>Task Manager</h1>
        </TitleLink>
      </HeaderLeftWrapper>

      <NavWrapper>
        <NavLink to="/" $mode={mode} $isActive={isHomeActive}>
          Tasks
        </NavLink>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
        >
          {mode === "dark" ? <FaSun color="#fbbc05" /> : <FaRegMoon color="#4285f4" />}
        </Button>
      </NavWrapper>
    </HeaderContainer>
  );
};