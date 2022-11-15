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
exports.triJson = exports.saveTask = exports.readTask = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const promises_2 = require("node:fs/promises");
const task_1 = require("./task");
async function readTask(fileName, reset = false) {
    const fileExist = await fileExists(fileName);
    if (!fileExist || reset) {
        const task = [];
        const isSave = await saveTask(fileName, task);
        if (isSave)
            return task;
        else
            throw new Error("Internal Error");
    }
    const buffer = await promises_1.default.readFile(fileName);
    const json = buffer.toString();
    return verifJson(json);
}
exports.readTask = readTask;
async function saveTask(fileName, tasks) {
    try {
        await promises_1.default.writeFile(fileName, JSON.stringify(tasks));
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.saveTask = saveTask;
async function fileExists(fileName) {
    try {
        await promises_1.default.access(fileName, promises_2.constants.F_OK);
        return true;
    }
    catch (err) {
        return false;
    }
}
function verifJson(data) {
    try {
        const objectJson = JSON.parse(data, task_1.Reviver);
        return objectJson;
    }
    catch (e) {
        throw new Error("File Format...");
    }
}
function triJson(tab) {
    let isChange;
    let tmp;
    do {
        isChange = false;
        for (let i = 0; i < tab.length - 1; i++) {
            if (tab[i].id > tab[i + 1].id) {
                tmp = tab[i];
                tab[i] = tab[i + 1];
                tab[i + 1] = tmp;
                isChange = true;
            }
        }
    } while (isChange);
    return tab;
}
exports.triJson = triJson;
