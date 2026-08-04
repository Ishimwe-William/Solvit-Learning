import type { Task } from "../types/Task";
import { TaskTable } from "./TaskTable";

export interface TaskTableViewGroupProps {
  activeTasks: Task[];
  completedTasks: Task[];
  onToggleComplete: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
}

export const TaskTableViewGroup: React.FC<TaskTableViewGroupProps> = ({
  activeTasks,
  completedTasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Active Tasks Table */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <h3 style={{ margin: 0, color: "var(--text-h, #f8fafc)", fontSize: "1.15rem" }}>
            Active Tasks ({activeTasks.length})
          </h3>
        </div>
        <TaskTable
          tasks={activeTasks}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          emptyMessage="No active tasks found matching your filter."
        />
      </div>

      {/* Completed Tasks Table */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <h3 style={{ margin: 0, color: "var(--text-h, #f8fafc)", fontSize: "1.15rem" }}>
            Completed Tasks ({completedTasks.length})
          </h3>
        </div>
        <TaskTable
          tasks={completedTasks}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          emptyMessage="No completed tasks yet."
        />
      </div>
    </div>
  );
};
