import { Button } from "./Button";
import { FaList, FaThLarge } from "react-icons/fa";
import styled from "styled-components";

export interface ViewSwitcherProps {
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
}

const SwitcherContainer = styled.div`
  display: flex;
  background-color: var(--code-bg, #1e293b);
  border-radius: 8px;
  border: 1px solid var(--border, #334155);
  padding: 2px;
`;

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <SwitcherContainer>
      <Button
        variant={viewMode === "table" ? "primary" : "text"}
        size="sm"
        onClick={() => onViewModeChange("table")}
        title="Table View"
        aria-label="Table View"
      >
        <FaList size={14} /> Table
      </Button>
      <Button
        variant={viewMode === "grid" ? "primary" : "text"}
        size="sm"
        onClick={() => onViewModeChange("grid")}
        title="Grid Cards View"
        aria-label="Grid Cards View"
      >
        <FaThLarge size={14} /> Cards
      </Button>
    </SwitcherContainer>
  );
};
