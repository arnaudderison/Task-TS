/* 
            _                               _   ____            _                 
           / \   _ __ _ __   __ _ _   _  __| | |  _ \  ___ _ __(_)___  ___  _ __  
          / _ \ | '__| '_ \ / _` | | | |/ _` | | | | |/ _ \ '__| / __|/ _ \| '_ \ 
         / ___ \| |  | | | | (_| | |_| | (_| | | |_| |  __/ |  | \__ \ (_) | | | |
        /_/   \_\_|  |_| |_|\__,_|\__,_|\__,_| |____/ \___|_|  |_|___/\___/|_| |_|

        Project idea by @fvilers. Github[https://github.com/fvilers]
*/

import fs from "node:fs/promises";
import { constants } from "node:fs/promises";
import { Reviver, Task } from "./task";


export async function readTask(fileName: string, reset: boolean = false): Promise<Task[]> {
    const fileExist = await fileExists(fileName);

    if (!fileExist || reset) {
        const task: Task[] = [];
        const isSave = await saveTask(fileName, task);

        if (isSave) return task;
        else throw new Error("Internal Error");
    }

    const buffer = await fs.readFile(fileName);
    const json: string = buffer.toString();
    return verifJson(json);
}

export async function saveTask(fileName: string, tasks: Task[]): Promise<boolean> {
    try {
        await fs.writeFile(fileName, JSON.stringify(tasks));
        return true;
    } catch (err) {
        return false;
    }
}

async function fileExists(fileName: string): Promise<boolean> {
    try {
        await fs.access(fileName, constants.F_OK)
        return true
    } catch (err) {
        return false
    }
}

function verifJson(data: string): Task[] {
    try {
        const objectJson = JSON.parse(data, Reviver);
        return objectJson;
    } catch (e) {
        throw new Error("File Format...");
    }
}

export function triJson(tab: Task[]): Task[] {
    let isChange: boolean;
    let tmp: Task;
    do {
        isChange = false;
        for (let i = 0; i < tab.length - 1; i++) {
            if (tab[i].id > tab[i+1].id) {
                tmp = tab[i];
                tab[i] = tab[i + 1];
                tab[i + 1] = tmp;
                isChange = true;
            }
        }
    } while (isChange)
    return tab;
}