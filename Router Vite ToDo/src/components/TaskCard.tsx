import type { Task } from "../types/Task";
import TaskStatus from "../constants/TaskSTatus";
import { Button } from "./Button";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import {
  CardContainer,
  CardHeader,
  Checkbox,
  CardTitle,
  StatusBadge,
  CardDescription,
  CardFooter,
  DateText,
  ActionGroup,
} from "../styles/components/taskCard";

export interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const isCompleted = task.status === TaskStatus.Completed;

  return (
    <CardContainer $isCompleted={isCompleted}>
      <CardHeader>
        <Checkbox
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => {
            e.stopPropagation();
            onToggleComplete(task.id);
          }}
          title={isCompleted ? "Mark as active" : "Mark as completed"}
        />
        <CardTitle
          $isCompleted={isCompleted}
          onClick={() => onViewDetails(task.id)}
          title="Click to view details"
        >
          {task.title}
        </CardTitle>
        <StatusBadge $status={task.status}>{task.status}</StatusBadge>
      </CardHeader>

      {task.description && <CardDescription>{task.description}</CardDescription>}

      <CardFooter>
        <DateText>{task.createdAt}</DateText>
        <ActionGroup>
          <Button
            variant="text"
            size="sm"
            onClick={() => onViewDetails(task.id)}
            title="View Task Details"
            aria-label="View Task Details"
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
        </ActionGroup>
      </CardFooter>
    </CardContainer>
  );
};
