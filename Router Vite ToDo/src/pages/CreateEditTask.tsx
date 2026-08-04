import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TaskStatus from "../constants/TaskSTatus";
import type { Task, TaskStatusType } from "../types/Task";
import { DEFAULT_TASKS } from "../constants/DEFAULT_TASKS";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";

import styled from "styled-components";

const FormCardContainer = styled.div`
  max-width: 640px;
  margin: 2.5rem auto;
  padding: 2rem;
  background-color: var(--code-bg, #1e293b);
  border: 1px solid var(--border, #334155);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  @media (max-width: 640px) {
    margin: 1.25rem auto;
    padding: 1.25rem 1rem;
    border-radius: 12px;
  }
`;

interface FormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
}

export const CreateEditTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const [tasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const isEditMode = Boolean(id);
  const editingTaskId = id ? Number(id) : null;
  const initialTask: Task | undefined =
    location.state || (editingTaskId ? tasks.find((t) => t.id === editingTaskId) : undefined);

  const defaultDueDate = new Date().toISOString().split("T")[0];

  const [isSaving, setIsSaving] = useState(false);
  const [taskForm, setTaskForm] = useState<{
    title: string;
    description: string;
    status: TaskStatusType;
    dueDate: string;
  }>({
    title: initialTask?.title || "",
    description: initialTask?.description || "",
    status: initialTask?.status || TaskStatus.Active,
    dueDate: initialTask?.dueDate || defaultDueDate,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ title?: boolean; description?: boolean; dueDate?: boolean }>({});

  useEffect(() => {
    if (initialTask) {
      setTaskForm({
        title: initialTask.title,
        description: initialTask.description,
        status: initialTask.status,
        dueDate: initialTask.dueDate || defaultDueDate,
      });
    }
  }, [initialTask, defaultDueDate]);

  const validateForm = (
    title: string,
    description: string,
    currentId: number | null
  ): FormErrors => {
    const errors: FormErrors = {};
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      errors.title = "Task title is required.";
    } else if (trimmedTitle.length < 3) {
      errors.title = "Task title must be at least 3 characters.";
    } else if (trimmedTitle.length > 80) {
      errors.title = "Task title cannot exceed 80 characters.";
    } else {
      const isDuplicate = tasks.some(
        (t) => t.id !== currentId && t.title.toLowerCase() === trimmedTitle.toLowerCase()
      );
      if (isDuplicate) {
        errors.title = "A task with this title already exists.";
      }
    }

    if (description.length > 300) {
      errors.description = "Description cannot exceed 300 characters.";
    }

    return errors;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errors = validateForm(taskForm.title, taskForm.description, editingTaskId);
    setFormErrors(errors);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedForm = { ...taskForm, [name]: value };
    setTaskForm(updatedForm as typeof taskForm);

    if (touched[name as keyof FormErrors]) {
      const errors = validateForm(updatedForm.title, updatedForm.description, editingTaskId);
      setFormErrors(errors);
    }
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, description: true });

    const errors = validateForm(taskForm.title, taskForm.description, editingTaskId);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      let updatedTasks: Task[];
      const formattedNow = new Date().toLocaleDateString();

      if (editingTaskId !== null) {
        updatedTasks = tasks.map((t) =>
          t.id === editingTaskId
            ? {
                ...t,
                title: taskForm.title.trim(),
                description: taskForm.description.trim(),
                status: taskForm.status,
                dueDate: taskForm.dueDate,
                updatedAt: formattedNow,
              }
            : t
        );
      } else {
        const newTask: Task = {
          id: Date.now(),
          title: taskForm.title.trim(),
          description: taskForm.description.trim(),
          status: taskForm.status,
          createdAt: formattedNow,
          dueDate: taskForm.dueDate,
          updatedAt: formattedNow,
        };
        updatedTasks = [newTask, ...tasks];
      }

      try {
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      } catch (err) {
        console.error("Failed to save to localStorage:", err);
      }

      setIsSaving(false);
      navigate("/");
    }, 300);
  };

  return (
    <FormCardContainer>
      <h2 style={{ color: "var(--text-h, #f8fafc)", marginBottom: "0.5rem", marginTop: 0 }}>
        {isEditMode ? "Edit Task" : "Create New Task"}
      </h2>
      <p style={{ color: "var(--text, #94a3b8)", marginBottom: "1.75rem" }}>
        {isEditMode
          ? "Update your existing task details."
          : "Add a new task to your task manager list."}
      </p>

      <form onSubmit={handleSaveTask} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Title Field */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "0.8rem", color: taskForm.title.length > 80 ? "#ef4444" : "#94a3b8", marginLeft: "auto" }}>
              {taskForm.title.length}/80
            </span>
          </div>
          <InputField
            id="task-title"
            name="title"
            label="Task Title *"
            value={taskForm.title}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter task title (3-80 chars)..."
            error={touched.title ? formErrors.title : undefined}
            autoFocus
          />
        </div>

        {/* Description Field */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <label htmlFor="task-description" style={{ color: "#cbd5e1", fontWeight: 600, fontSize: "0.875rem" }}>
              Description
            </label>
            <span style={{ fontSize: "0.8rem", color: taskForm.description.length > 300 ? "#ef4444" : "#94a3b8" }}>
              {taskForm.description.length}/300
            </span>
          </div>
          <textarea
            id="task-description"
            name="description"
            value={taskForm.description}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter task description (max 300 chars)..."
            rows={4}
            style={{
              width: "100%",
              padding: "0.6rem 0.85rem",
              borderRadius: "8px",
              border: touched.description && formErrors.description ? "1px solid #ef4444" : "1px solid var(--border, #334155)",
              backgroundColor: "var(--bg, #0f172a)",
              color: "var(--text-h, #f8fafc)",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
              fontSize: "0.9rem",
            }}
          />
          {touched.description && formErrors.description && (
            <span style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.25rem", display: "block" }}>
              {formErrors.description}
            </span>
          )}
        </div>

        {/* Due Date & Status Row */}
        <div className="form-row-grid">
          <div>
            <InputField
              id="task-due-date"
              name="dueDate"
              type="date"
              label="Due Date"
              value={taskForm.dueDate}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="task-status" style={{ color: "#cbd5e1", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.4rem" }}>
              Status
            </label>
            <select
              id="task-status"
              name="status"
              value={taskForm.status}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "0.6rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid var(--border, #334155)",
                backgroundColor: "var(--bg, #0f172a)",
                color: "var(--text-h, #f8fafc)",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
                fontSize: "0.9rem",
              }}
            >
              <option value={TaskStatus.Active}>Active</option>
              <option value={TaskStatus.Pending}>Pending</option>
              <option value={TaskStatus.Completed}>Completed</option>
              <option value={TaskStatus.Cancelled}>Cancelled</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
          <Button variant="secondary" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {isEditMode ? "Update Task" : "Save Task"}
          </Button>
        </div>
      </form>
    </FormCardContainer>
  );
};
