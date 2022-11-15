/* 
            _                               _   ____            _                 
           / \   _ __ _ __   __ _ _   _  __| | |  _ \  ___ _ __(_)___  ___  _ __  
          / _ \ | '__| '_ \ / _` | | | |/ _` | | | | |/ _ \ '__| / __|/ _ \| '_ \ 
         / ___ \| |  | | | | (_| | |_| | (_| | | |_| |  __/ |  | \__ \ (_) | | | |
        /_/   \_\_|  |_| |_|\__,_|\__,_|\__,_| |____/ \___|_|  |_|___/\___/|_| |_|

        Project idea by @fvilers. Github[https://github.com/fvilers]
*/

import os from "os";
import path from "path";
import { Task } from "./task";
import { readTask, saveTask } from "./utils";

export const DEFAULT_FILENAME = path.join(os.homedir(), "dataTasks.json");

export async function addTask(task: string): Promise<number> {

    const tasks: Task[] = await readTask(DEFAULT_FILENAME);
    const id: number = Math.max(...tasks.map(task => task.id)) + 1

    tasks.push({ id, task, done: false })

    await saveTask(DEFAULT_FILENAME, tasks);
    return id;
}

export async function deleteTask(id: number): Promise<number> {
    const tasks: Task[] = await readTask(DEFAULT_FILENAME);
    const newTasks: Task[] = tasks.filter(task => task.id != id);

    if (tasks.length === newTasks.length) {
        throw new Error("An error occurred while deleting the task")
    }

    await saveTask(DEFAULT_FILENAME, newTasks);

    return id;
}

export async function writeList(isAll: boolean = false): Promise<Task[]> {
    if (isAll) {
        try {
            const tasks = await readTask(DEFAULT_FILENAME);
            return tasks;
        } catch (err) {
            throw new Error('Error on read tasks');
        }
    } else {
        const tasks = await readTask(DEFAULT_FILENAME);
        return tasks.filter((task) => !task.done);

    }
}

export async function doneAndUndoneTask(id: number, isDone: boolean): Promise<number> {
    try {
        const tasks: Task[] = await readTask(DEFAULT_FILENAME);
        const updateTask: Task | undefined = tasks.find((task: Task) => task.id === id);

        if (updateTask !== undefined) {
            updateTask.done = isDone;
            await saveTask(DEFAULT_FILENAME, tasks);
            return updateTask.id;
        }
        return -1;

    } catch (err) {
        return -1;
    }
}

export async function swapTasks(id1: number, id2: number): Promise<number> {
    try {
        const tasks: Task[] = await readTask(DEFAULT_FILENAME);

        const taskOne: Task | undefined = tasks.find((task: Task) => task.id === id1);
        const taskTwo: Task | undefined = tasks.find((task: Task) => task.id === id2);

        if (taskOne === undefined || taskTwo === undefined) return -1;

        taskOne.id = id2;
        taskTwo.id = id1;

        await saveTask(DEFAULT_FILENAME, tasks);
        return taskOne.id;

    } catch (err) {
        return -1;
    }
}
