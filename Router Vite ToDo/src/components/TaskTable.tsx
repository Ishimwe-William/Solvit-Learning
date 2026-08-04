import type { Task } from "../types/Task";
import TaskStatus from "../constants/TaskSTatus";
import { Button } from "./Button";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { StatusBadge } from "../styles/components/taskCard";
import {
  TableContainer,
  StyledTable,
  TableHead,
  TableBody,
  TableRow,
  CheckboxCell,
  TableCellTitle,
  TableCellDesc,
  EmptyTableState,
  ActionsCell,
} from "../styles/components/table";

export interface TaskTableProps {
  tasks: Task[];
  onToggleComplete: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
  emptyMessage?: string;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onViewDetails,
  emptyMessage = "No tasks found",
}) => {
  if (tasks.length === 0) {
    return <EmptyTableState>{emptyMessage}</EmptyTableState>;
  }

  return (
    <TableContainer>
      <StyledTable>
        <TableHead>
          <tr>
            <th style={{ width: "45px", textAlign: "center" }}>Done</th>
            <th>Task Title</th>
            <th className="col-desc">Description</th>
            <th>Status</th>
            <th className="col-created">Created</th>
            <th className="col-due">Due Date</th>
            <th style={{ width: "100px", textAlign: "right" }}>Actions</th>
          </tr>
        </TableHead>
        <TableBody>
          {tasks.map((task) => {
            const isCompleted = task.status === TaskStatus.Completed;

            return (
              <TableRow key={task.id} $isCompleted={isCompleted}>
                <td>
                  <CheckboxCell>
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={(e) => {
                        e.stopPropagation();
                        onToggleComplete(task.id);
                      }}
                      title={isCompleted ? "Mark as active" : "Mark as completed"}
                    />
                  </CheckboxCell>
                </td>
                <td>
                  <TableCellTitle
                    $isCompleted={isCompleted}
                    onClick={() => onViewDetails(task.id)}
                    title="Click to view task details"
                  >
                    {task.title}
                  </TableCellTitle>
                </td>
                <td className="col-desc">
                  <TableCellDesc title={task.description || "No description"}>
                    {task.description || "—"}
                  </TableCellDesc>
                </td>
                <td>
                  <StatusBadge $status={task.status}>{task.status}</StatusBadge>
                </td>
                <td className="col-created" style={{ fontSize: "0.85rem", color: "var(--text, #94a3b8)", whiteSpace: "nowrap" }}>
                  {task.createdAt}
                </td>
                <td className="col-due" style={{ fontSize: "0.85rem", color: task.dueDate ? "#38bdf8" : "var(--text, #94a3b8)", whiteSpace: "nowrap" }}>
                  {task.dueDate || "—"}
                </td>
                <td>
                  <ActionsCell style={{ justifyContent: "flex-end" }}>
                    <Button
                      variant="text"
                      size="sm"
                      onClick={() => onViewDetails(task.id)}
                      title="View Details"
                      aria-label="View Details"
                    >
                      <FaEye size={13} />
                    </Button>
                    <Button
                      variant="text"
                      size="sm"
                      onClick={() => onEdit(task)}
                      title="Edit Task"
                      aria-label="Edit Task"
                    >
                      <FaEdit size={13} />
                    </Button>
                    <Button
                      variant="text"
                      size="sm"
                      onClick={() => onDelete(task.id)}
                      title="Delete Task"
                      aria-label="Delete Task"
                    >
                      <FaTrash size={13} color="#ea4335" />
                    </Button>
                  </ActionsCell>
                </td>
              </TableRow>
            );
          })}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};
