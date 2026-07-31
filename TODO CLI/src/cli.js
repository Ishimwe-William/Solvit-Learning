import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import * as taskManager from './taskManager.js';

function getInputInterface() {
    return readline.createInterface({ input, output });
}

const menuOptions = `
    --- Menu ---
    0. List All Tasks
    1. Create Task
    2. View Pending Tasks  
    3. Edit Task details
    4. Complete/Cancel Task
    5. Delete Task
    6. Exit 
\n`;

function printTasks(sentTasks) {
    console.log(sentTasks.length > 0 ?
        "\n--- Tasks List ---" :
        "\n--- No Tasks available! ---");
    sentTasks.forEach(task =>
        console.log(`Task ${task.id} [${task.status.toUpperCase()}]: \n\tName: ${task.name}\n\tDescription: ${task.description}`)
    );
}

async function getTaskData(rl, isEditMode) {
    try {
        const name = await rl.question("Task name (Press enter to skip): ");
        const description = await rl.question("Task description (Press enter to skip): ");
        let status = taskManager.Statuses.PENDING;

        if (isEditMode) {
            const statusChoice = await rl.question("Enter 1 to mark as completed, 2 to cancel or 0 to leave unchanged: ");
            switch (statusChoice.trim()) {
                case '1':
                    status = taskManager.Statuses.COMPLETED;
                    break;
                case '2':
                    status = taskManager.Statuses.CANCELLED;
                    break;
                default:
                    status = undefined;
                    break;
            }
        }
        return { name, description, status };
    } catch (error) {
        console.log(error);
    }
}

async function selectTask(rl) {
    const selectionInput = await rl.question("Enter the task ID: ");
    const targetId = parseInt(selectionInput.trim(), 10);

    const matchedTask = taskManager.getTaskById(targetId);
    if (!matchedTask) {
        console.log(">> Invalid task ID!");
        return null;
    }
    return matchedTask;
}

export async function runCLI() {
    await taskManager.loadTasksFromFile();

    const rl = getInputInterface();
    let keepRunning = true;

    console.log("\n--- Task Manager CLI ---");

    try {
        while (keepRunning) {
            const choice = await rl.question(menuOptions + 'Select option: ');

            switch (choice.trim()) {
                case '0':
                    printTasks(taskManager.getAllTasks());
                    break;
                case '1': {
                    const data = await getTaskData(rl, false);
                    if (!data.name || !data.description) {
                        console.log(">> Task name and description are required!");
                    } else {
                        const newTask = await taskManager.createTask(data);
                        console.log(`\nTask '${newTask.name}' created successfully!`);
                    }
                    printTasks(taskManager.getAllTasks());
                    break;
                }
                case '2':
                    printTasks(taskManager.getPendingTasks());
                    break;
                case '3': {
                    printTasks(taskManager.getAllTasks());
                    const targetTask = await selectTask(rl);
                    if (targetTask) {
                        console.log("\nEnter new details:");
                        const updates = await getTaskData(rl, true);
                        await taskManager.updateTask(targetTask.id, updates);
                        console.log(`>> Task ${targetTask.id} successfully updated!`);
                    }
                    printTasks(taskManager.getAllTasks());
                    break;
                }
                case '4': {
                    printTasks(taskManager.getAllTasks());
                    const targetTask = await selectTask(rl);
                    if (targetTask) {
                        const choice = await rl.question("Choose new status (1: COMPLETED, 2: CANCELLED): ");
                        let newStatus;
                        if (choice.trim() === '1') newStatus = taskManager.Statuses.COMPLETED;
                        else if (choice.trim() === '2') newStatus = taskManager.Statuses.CANCELLED;

                        if (newStatus) {
                            await taskManager.updateTask(targetTask.id, { status: newStatus });
                            console.log(`>> Status of Task ${targetTask.id} changed to ${newStatus}!`);
                        } else {
                            console.log(">> Invalid choice. Status left unchanged.");
                        }
                    }
                    break;
                }
                case '5': {
                    printTasks(taskManager.getAllTasks());
                    const targetTask = await selectTask(rl);
                    if (targetTask) {
                        await taskManager.deleteTask(targetTask.id);
                        console.log(`>> Task ${targetTask.id} permanently deleted!`);
                    }
                    break;
                }
                case '6':
                    console.log("\nClosing Application... Bye!");
                    keepRunning = false;
                    break;
                default:
                    console.log(">> Wrong option!");
            }
            console.log("\n----------------------------");
        }
    } catch (error) {
        console.log("Application Error:", error);
    } finally {
        rl.close();
    }
}

if (process.argv[1] && (process.argv[1].endsWith('cli.js') || process.argv[1].endsWith('cli'))) {
    runCLI();
}
