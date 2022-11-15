"use strict";
/*
            _                               _   ____            _
           / \   _ __ _ __   __ _ _   _  __| | |  _ \  ___ _ __(_)___  ___  _ __
          / _ \ | '__| '_ \ / _` | | | |/ _` | | | | |/ _ \ '__| / __|/ _ \| '_ \
         / ___ \| |  | | | | (_| | |_| | (_| | | |_| |  __/ |  | \__ \ (_) | | | |
        /_/   \_\_|  |_| |_|\__,_|\__,_|\__,_| |____/ \___|_|  |_|___/\___/|_| |_|

*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapTasks = exports.doneAndUndoneTask = exports.writeList = exports.deleteTask = exports.addTask = exports.DEFAULT_FILENAME = void 0;
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
exports.DEFAULT_FILENAME = path_1.default.join(os_1.default.homedir(), "dataTasks.json");
async function addTask(task) {
    const tasks = await (0, utils_1.readTask)(exports.DEFAULT_FILENAME);
    const id = Math.max(...tasks.map(task => task.id)) + 1;
    tasks.push({ id, task, done: false });
    await (0, utils_1.saveTask)(exports.DEFAULT_FILENAME, tasks);
    return id;
}
exports.addTask = addTask;
async function deleteTask(id) {
    const tasks = await (0, utils_1.readTask)(exports.DEFAULT_FILENAME);
    const newTasks = tasks.filter(task => task.id != id);
    if (tasks.length === newTasks.length) {
        throw new Error("An error occurred while deleting the task");
    }
    await (0, utils_1.saveTask)(exports.DEFAULT_FILENAME, newTasks);
    return id;
}
exports.deleteTask = deleteTask;
async function writeList(isAll = false) {
    if (isAll) {
        try {
            const tasks = await (0, utils_1.readTask)(exports.DEFAULT_FILENAME);
            return tasks;
        }
        catch (err) {
            throw new Error('Error on read tasks');
        }
    }
    else {
        const tasks = await (0, utils_1.readTask)(exports.DEFAULT_FILENAME);
        return tasks.filter((task) => !task.done);
    }
}
exports.writeList = writeList;
async function doneAndUndoneTask(id, isDone) {
    try {
        const tasks = await (0, utils_1.readTask)(exports.DEFAULT_FILENAME);
        const updateTask = tasks.find((task) => task.id === id);
        if (updateTask !== undefined) {
            updateTask.done = isDone;
            await (0, utils_1.saveTask)(exports.DEFAULT_FILENAME, tasks);
            return updateTask.id;
        }
        return -1;
    }
    catch (err) {
        return -1;
    }
}
exports.doneAndUndoneTask = doneAndUndoneTask;
async function swapTasks(id1, id2) {
    try {
        const tasks = await (0, utils_1.readTask)(exports.DEFAULT_FILENAME);
        const taskOne = tasks.find((task) => task.id === id1);
        const taskTwo = tasks.find((task) => task.id === id2);
        if (taskOne === undefined || taskTwo === undefined)
            return -1;
        taskOne.id = id2;
        taskTwo.id = id1;
        await (0, utils_1.saveTask)(exports.DEFAULT_FILENAME, tasks);
        return taskOne.id;
    }
    catch (err) {
        return -1;
    }
}
exports.swapTasks = swapTasks;
