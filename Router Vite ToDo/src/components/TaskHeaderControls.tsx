import { Button } from "./Button";
import { ViewSwitcher } from "./ViewSwitcher";
import styled from "styled-components";

export interface TaskHeaderControlsProps {
  activeCount: number;
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
  onAddTaskClick: () => void;
}

const ActionsGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }
`;

export const TaskHeaderControls: React.FC<TaskHeaderControlsProps> = ({
  activeCount,
  viewMode,
  onViewModeChange,
  onAddTaskClick,
}) => {
  return (
    <section className="controls-section">
      <div className="task-header-left">
        <div className="task-count-row">
          <span className="task-title-text">Tasks</span>
          <span className="task-remaining-badge">{activeCount} remaining</span>
        </div>
        <p className="task-subtitle">Manage your daily tasks and workflow priorities.</p>
      </div>

      <ActionsGroup>
        <ViewSwitcher viewMode={viewMode} onViewModeChange={onViewModeChange} />
        <Button type="button" onClick={onAddTaskClick}>
          + Add Task
        </Button>
      </ActionsGroup>
    </section>
  );
};
