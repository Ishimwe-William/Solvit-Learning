import { useState, useEffect } from "react";
import TaskStatus from "../constants/TaskSTatus";
import { DEFAULT_TASKS } from "../constants/DEFAULT_TASKS";
import type { Task } from "../types/Task";

type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const [filterStatus, setFilterStatus] = useState<TaskStatusType>(TaskStatus.All);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage:", error);
    }
  }, [tasks]);

  const activeCount = tasks.filter(
    (t) => t.status === TaskStatus.Active || t.status === TaskStatus.Pending
  ).length;

  const statusCounts = Object.values(TaskStatus).reduce((acc, status) => {
    if (status === TaskStatus.All) {
      acc[status] = tasks.length;
    } else {
      acc[status] = tasks.filter((t) => t.status === status).length;
    }
    return acc;
  }, {} as Record<string, number>);

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleComplete = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus =
            t.status === TaskStatus.Completed ? TaskStatus.Active : TaskStatus.Completed;
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const filterTasks = (taskList: Task[], isCompletedColumn?: boolean) => {
    return taskList.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (isCompletedColumn !== undefined) {
        const isCompleted = t.status === TaskStatus.Completed;
        if (isCompletedColumn !== isCompleted) return false;
      }

      if (filterStatus === TaskStatus.All) return matchesSearch;
      return matchesSearch && t.status === filterStatus;
    });
  };

  const activeTasks = filterTasks(tasks, false);
  const completedTasks = filterTasks(tasks, true);

  return {
    tasks,
    activeCount,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    statusCounts,
    activeTasks,
    completedTasks,
    handleDeleteTask,
    handleToggleComplete,
  };
};
