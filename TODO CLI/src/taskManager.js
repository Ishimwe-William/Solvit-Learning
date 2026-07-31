import fs from 'node:fs/promises';
import path from 'node:path';

const FILE_PATH = path.resolve('./tasks.json');

export const Statuses = Object.freeze({
    'PENDING': 'pending',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled'
});

let tasks = [];

export async function loadTasksFromFile() {
    try {
        const fileContent = await fs.readFile(FILE_PATH, 'utf8');
        tasks = JSON.parse(fileContent);
    } catch (error) {
        if (error.code === 'ENOENT') {
            tasks = [{
                'id': 1,
                'name': 'Build Task Manager GUI',
                'description': 'Connect frontend controls to Node server endpoints',
                'status': Statuses.COMPLETED
            }, {
                'id': 2,
                'name': 'DOM Manipulation Module',
                'description': 'Fetch tasks dynamically via REST API',
                'status': Statuses.PENDING
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
    } catch (error) {
        console.error(">> Error writing data to disk storage:", error.message);
    }
}

export function getAllTasks() {
    return tasks;
}

export function getPendingTasks() {
    return tasks.filter(t => t.status === Statuses.PENDING);
}

export function getTaskById(id) {
    const numericId = parseInt(id, 10);
    return tasks.find(t => t.id === numericId) || null;
}

export async function createTask({ name, description }) {
    if (!name || !name.trim()) {
        throw new Error("Task name is required");
    }

    const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        name: name.trim(),
        description: (description || '').trim(),
        status: Statuses.PENDING
    };

    tasks.push(newTask);
    await saveTasksToFile();
    return newTask;
}

export async function updateTask(id, updates) {
    const numericId = parseInt(id, 10);
    let updatedTask = null;

    tasks = tasks.map(task => {
        if (task.id === numericId) {
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

export async function deleteTask(id) {
    const numericId = parseInt(id, 10);
    const initialLength = tasks.length;
    tasks = tasks.filter(t => t.id !== numericId);

    if (tasks.length === initialLength) {
        throw new Error(`Task with ID ${id} not found`);
    }

    await saveTasksToFile();
    return { success: true, id: numericId };
}
