import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Task } from "../types/Task";
import TaskStatus from "../constants/TaskSTatus";
import { DEFAULT_TASKS } from "../constants/DEFAULT_TASKS";
import { Button } from "../components/Button";
import { FaArrowLeft, FaEdit, FaTrash, FaCheckCircle, FaUndo } from "react-icons/fa";
import styled from "styled-components";

const DetailsContainer = styled.div`
  max-width: 720px;
  margin: 2.5rem auto;
  padding: 0 1rem;

  @media (max-width: 640px) {
    margin: 1.25rem auto;
    padding: 0 0.75rem;
  }
`;

const DetailsCard = styled.div`
  background-color: var(--code-bg, #1e293b);
  border: 1px solid var(--border, #334155);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  @media (max-width: 640px) {
    padding: 1.25rem 1rem;
    border-radius: 12px;
  }
`;

const DetailsTitle = styled.h1<{ $isCompleted?: boolean }>`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-h, #f8fafc);
  margin: 0 0 1rem;
  text-decoration: ${({ $isCompleted }) => ($isCompleted ? "line-through" : "none")};
  opacity: ${({ $isCompleted }) => ($isCompleted ? 0.8 : 1)};
  word-break: break-word;

  @media (max-width: 640px) {
    font-size: 1.35rem;
  }
`;

const DetailsActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border, #334155);
  flex-wrap: wrap;

  @media (max-width: 540px) {
    flex-direction: column;
    align-items: stretch;

    button,
    a {
      width: 100%;
      justify-content: center;
    }
  }
`;

const RightActions = styled.div`
  display: flex;
  gap: 0.75rem;

  @media (max-width: 540px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const taskId = id ? Number(id) : null;
  const task = tasks.find((t) => t.id === taskId);

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (err) {
      console.error("Failed to save tasks to localStorage:", err);
    }
  }, [tasks]);

  const handleToggleComplete = () => {
    if (!task) return;
    const nextStatus =
      task.status === TaskStatus.Completed ? TaskStatus.Active : TaskStatus.Completed;

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
    );
  };

  const handleDelete = () => {
    if (!task) return;
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    navigate("/");
  };

  if (!task) {
    return (
      <DetailsContainer style={{ textAlign: "center", padding: "3rem 1rem" }}>
        <h2 style={{ color: "#f8fafc", marginBottom: "1rem" }}>Task Not Found</h2>
        <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
          The task you are looking for does not exist or has been deleted.
        </p>
        <Button onClick={() => navigate("/")} variant="primary">
          <FaArrowLeft /> Back to Tasks
        </Button>
      </DetailsContainer>
    );
  }

  const isCompleted = task.status === TaskStatus.Completed;

  return (
    <DetailsContainer>
      {/* Top Navigation */}
      <div style={{ marginBottom: "1.25rem" }}>
        <Button variant="outline" size="sm" onClick={() => navigate("/")}>
          <FaArrowLeft /> Back to Tasks
        </Button>
      </div>

      {/* Main Task Detail Card */}
      <DetailsCard>
        {/* Header Badges */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text, #94a3b8)", fontWeight: 600 }}>
            Task #{task.id}
          </span>
          <span className={`task-status-badge ${task.status}`}>{task.status}</span>
        </div>

        {/* Title */}
        <DetailsTitle $isCompleted={isCompleted}>{task.title}</DetailsTitle>

        {/* Description */}
        <div style={{ margin: "1.25rem 0", padding: "1rem", backgroundColor: "var(--bg, #0f172a)", borderRadius: "12px", border: "1px solid var(--border, #334155)" }}>
          <h4 style={{ margin: "0 0 0.4rem", color: "#cbd5e1", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Description
          </h4>
          <p style={{ margin: 0, color: task.description ? "var(--text-h, #f8fafc)" : "var(--text, #94a3b8)", fontStyle: task.description ? "normal" : "italic", lineHeight: 1.6, fontSize: "0.9rem" }}>
            {task.description || "No description provided for this task."}
          </p>
        </div>

        {/* Date Timestamps */}
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", fontSize: "0.85rem", color: "var(--text, #94a3b8)", marginBottom: "1.75rem" }}>
          <div>
            Created: <strong style={{ color: "#cbd5e1" }}>{task.createdAt}</strong>
          </div>
          {task.dueDate && (
            <div>
              Due Date: <strong style={{ color: "#38bdf8" }}>{task.dueDate}</strong>
            </div>
          )}
          {task.updatedAt && (
            <div>
              Updated: <strong style={{ color: "#cbd5e1" }}>{task.updatedAt}</strong>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <DetailsActions>
          <Button
            variant={isCompleted ? "secondary" : "primary"}
            onClick={handleToggleComplete}
          >
            {isCompleted ? <FaUndo /> : <FaCheckCircle />}
            {isCompleted ? "Mark as Active" : "Mark as Completed"}
          </Button>

          <RightActions>
            <Button
              variant="outline"
              onClick={() => navigate(`/tasks/${task.id}/edit`, { state: task })}
            >
              <FaEdit /> Edit Task
            </Button>
            <Button variant="secondary" onClick={handleDelete}>
              <FaTrash color="#ea4335" /> Delete
            </Button>
          </RightActions>
        </DetailsActions>
      </DetailsCard>
    </DetailsContainer>
  );
};
