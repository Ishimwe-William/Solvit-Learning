import * as fs from 'node:fs/promises';
import path from 'node:path';
import * as tdo from './tdo.ts'

const FILE_PATH: string = path.resolve('./tasks.json');

var tasks: tdo.taskModel[] = [];

export async function loadTasksFromFile() {
    try {
        const fileContent = await fs.readFile(FILE_PATH, 'utf8');
        tasks = JSON.parse(fileContent);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            tasks = [{
                'id': 1,
                'name': 'Build Task Manager GUI',
                'description': 'Connect frontend controls to Node server endpoints',
                'status': tdo.EStatuses.COMPLETED
            }, {
                'id': 2,
                'name': 'DOM Manipulation Module',
                'description': 'Fetch tasks dynamically via REST API',
                'status': tdo.EStatuses.PENDING
            }];
            await saveTasksToFile();
        } else {
            console.error(">> Error reading storage file:", error.message);
        }
    }
    return tasks;
}

export async function saveTasksToFile() {
    try {
        await fs.writeFile(FILE_PATH, JSON.stringify(tasks, null, 2), 'utf8');
    } catch (error: any) {
        console.error(">> Error writing data to disk storage:", error.message);
    }
}

export function getAllTasks() {
    return tasks;
}

export function getPendingTasks() {
    return tasks.filter(t => t.status === tdo.EStatuses.PENDING);
}

export function getTaskById(id: number) {
    return tasks.find(t => t.id === id) || null;
}

export async function createTask(dto: tdo.CreateTaskDTO) {
    const name = dto.name || dto.taskName;
    if (!name || !name.trim()) {
        throw new Error("Task name is required");
    }

    const newTask: tdo.taskModel = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        name: name.trim(),
        description: (dto.description || '').trim(),
        status: tdo.EStatuses.PENDING
    };

    tasks.push(newTask);
    await saveTasksToFile();
    return newTask;
}

export async function updateTask(id: number, updates: Partial<tdo.taskModel>) {
    let updatedTask = null;

    tasks = tasks.map(task => {
        if (task.id === id) {
            updatedTask = {
                ...task,
                name: updates.name !== undefined ? updates.name.trim() : task.name,
                description: updates.description !== undefined ? updates.description.trim() : task.description,
                status: updates.status !== undefined ? updates.status : task.status
            };
            return updatedTask;
        }
        return task;
    });

    if (!updatedTask) {
        throw new Error(`Task with ID ${id} not found`);
    }

    await saveTasksToFile();
    return updatedTask;
}

export async function deleteTask(id: number) {
    const initialLength = tasks.length;
    tasks = tasks.filter(t => t.id !== id);

    if (tasks.length === initialLength) {
        throw new Error(`Task with ID ${id} not found`);
    }

    await saveTasksToFile();
    return { success: true, id: id };
}
