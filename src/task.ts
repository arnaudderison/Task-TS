/* 
            _                               _   ____            _                 
           / \   _ __ _ __   __ _ _   _  __| | |  _ \  ___ _ __(_)___  ___  _ __  
          / _ \ | '__| '_ \ / _` | | | |/ _` | | | | |/ _ \ '__| / __|/ _ \| '_ \ 
         / ___ \| |  | | | | (_| | |_| | (_| | | |_| |  __/ |  | \__ \ (_) | | | |
        /_/   \_\_|  |_| |_|\__,_|\__,_|\__,_| |____/ \___|_|  |_|___/\___/|_| |_|

        Project idea by @fvilers. Github[https://github.com/fvilers]
*/
export type Task = {
    id: number;
    task: string;
    done: boolean;
}

export function Reviver(key: string, value: any): any {
    if(key === "" && Array.isArray(value)){ 
        return value;
    }
    switch (key) {
        case "id":
            if (isNaN(value)) {
                throw new Error("Error File format...");
            }
            return value;
        case "task":
            if (!(typeof value === "string")) {
                throw new Error("Error File format...");
            }
            return value;
        case "done":
            if (!(typeof value === "boolean")) {
                throw new Error("Error File format...");
            }
            return value;
        default:
            if(!isNaN(parseInt(key,10))){
                return value;
            }
            throw new Error("Error File format...")
    }
}