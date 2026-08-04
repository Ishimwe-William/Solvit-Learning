import type { Task } from "../types/Task";
import { TaskCard } from "./TaskCard";

export interface TaskGridViewProps {
  activeTasks: Task[];
  completedTasks: Task[];
  onToggleComplete: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
}

export const TaskGridView: React.FC<TaskGridViewProps> = ({
  activeTasks,
  completedTasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  return (
    <div className="todo-columns-row">
      {/* Active & Pending ToDos */}
      <div className="todo-column left-column">
        <div className="column-header">
          <h2>Active ToDos</h2>
          <span className="column-count">{activeTasks.length}</span>
        </div>
        <div className="column-tasks">
          {activeTasks.length === 0 ? (
            <div className="empty-state">No active tasks found</div>
          ) : (
            activeTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
              />
            ))
          )}
        </div>
      </div>

      {/* Completed ToDos */}
      <div className="todo-column right-column">
        <div className="column-header">
          <h2>Completed ToDos</h2>
          <span className="column-count">{completedTasks.length}</span>
        </div>
        <div className="column-tasks">
          {completedTasks.length === 0 ? (
            <div className="empty-state">No completed tasks yet</div>
          ) : (
            completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
