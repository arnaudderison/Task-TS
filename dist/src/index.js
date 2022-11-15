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
const package_json_1 = require("../package.json");
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const table_1 = require("table");
const command_1 = require("./command");
const utils_1 = require("./utils");
const program = new commander_1.Command();
program
    .name(package_json_1.name.replace("Arnaud Derison", ""))
    .version(package_json_1.version)
    .description(package_json_1.description);
program
    .command("add")
    .description("add a task")
    .argument('<task>', "The task", verifTaskNotEmpty)
    .action(async (task) => {
    console.log(chalk_1.default.blue.bold("Task ID is: " + chalk_1.default.green(`${await (0, command_1.addTask)(task)}`)));
});
program
    .command("delete")
    .description("delete a task")
    .argument('<id>', "The task ID", verifTaskId)
    .action(async (id) => {
    console.log("Delete task : " + `${await (0, command_1.deleteTask)(id)}`);
});
program
    .command("list")
    .option("-a, --all", "Include done tasks")
    .description("list tasks")
    .action(async (options) => {
    const tasks = await (0, command_1.writeList)(options.all);
    const data = [[chalk_1.default.bold.cyan("ID"), chalk_1.default.bold.cyan("Task")]];
    (0, utils_1.triJson)(tasks).map(task => {
        data.push([
            chalk_1.default.italic.bold(task.id),
            task.done ? chalk_1.default.green(task.task) : chalk_1.default.red(task.task)
        ]);
    });
    console.log((0, table_1.table)(data));
});
program
    .command("done")
    .description("Done a task")
    .argument('<id>', "The task ID", verifTaskId)
    .action(async (id) => {
    const isDoneOrUndone = await (0, command_1.doneAndUndoneTask)(id, true);
    isDoneOrUndone === -1 && program.error(chalk_1.default.red.bold("An error occurred while done the tasks"));
});
program
    .command("undone")
    .description("Undone a task")
    .argument('<id>', "The task ID", verifTaskId)
    .action(async (id) => {
    const isDoneOrUndone = await (0, command_1.doneAndUndoneTask)(id, false);
    isDoneOrUndone === -1 && program.error(chalk_1.default.red.bold("An error occurred while undone the tasks"));
});
program
    .command("reset")
    .description("reset tasks")
    .action(async () => {
    try {
        await (0, utils_1.readTask)(command_1.DEFAULT_FILENAME, true);
    }
    catch (err) {
        program.error(chalk_1.default.red.bold("An error occurred while reset the tasks"));
    }
});
program
    .command("swap")
    .description("swap task")
    .argument('<id1>', "First task id", verifTaskId)
    .argument("<id2>", "second task id", verifTaskId)
    .action(async (id1, id2) => {
    try {
        await (0, command_1.swapTasks)(id1, id2);
    }
    catch (err) {
        program.error(chalk_1.default.red.bold("An error occurred while reset the tasks"));
    }
});
function verifTaskNotEmpty(task) {
    if (task === "") {
        throw new commander_1.InvalidArgumentError(chalk_1.default.red.bold('The task cannot be empty'));
    }
    return task;
}
function verifTaskId(value) {
    const id = parseInt(value, 10);
    if (isNaN(id)) {
        throw new commander_1.InvalidArgumentError(chalk_1.default.red.bold('The task id in not valid'));
    }
    return id;
}
program.parse();
program.showHelpAfterError();
