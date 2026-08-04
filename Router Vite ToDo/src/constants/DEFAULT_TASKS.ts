import type { Task } from "../types/Task";
import TaskStatus from "./TaskSTatus";

const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

export const DEFAULT_TASKS: Task[] = [
  {
    id: 1,
    title: 'Build Vite React App',
    description: 'Setup initial project structure and components',
    status: TaskStatus.Completed,
    createdAt: new Date().toLocaleDateString(),
    dueDate: today,
    updatedAt: new Date().toLocaleDateString(),
  },
  {
    id: 2,
    title: 'Style Bunsenplus Brand',
    description: 'Apply vibrant Google colors to Bunsenplus brand header',
    status: TaskStatus.Active,
    createdAt: new Date().toLocaleDateString(),
    dueDate: tomorrow,
    updatedAt: new Date().toLocaleDateString(),
  },
  {
    id: 3,
    title: 'Implement Task Workflow',
    description: 'Add support for active, pending, and completed task states',
    status: TaskStatus.Active,
    createdAt: new Date().toLocaleDateString(),
    dueDate: tomorrow,
    updatedAt: new Date().toLocaleDateString(),
  },
];