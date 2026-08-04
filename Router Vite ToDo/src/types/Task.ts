import TaskStatus from "../constants/TaskSTatus";

export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatusType;
    createdAt: string;
    dueDate?: string;
    updatedAt?: string;
}
