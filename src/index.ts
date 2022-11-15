/* 
            _                               _   ____            _                 
           / \   _ __ _ __   __ _ _   _  __| | |  _ \  ___ _ __(_)___  ___  _ __  
          / _ \ | '__| '_ \ / _` | | | |/ _` | | | | |/ _ \ '__| / __|/ _ \| '_ \ 
         / ___ \| |  | | | | (_| | |_| | (_| | | |_| |  __/ |  | \__ \ (_) | | | |
        /_/   \_\_|  |_| |_|\__,_|\__,_|\__,_| |____/ \___|_|  |_|___/\___/|_| |_|

        Project idea by @fvilers. Github[https://github.com/fvilers]
*/

import { name, description, version } from "../package.json";
import { Command, InvalidArgumentError } from "commander";
import chalk from "chalk";
import { table } from 'table';
import { addTask, DEFAULT_FILENAME, deleteTask, doneAndUndoneTask, writeList, swapTasks } from "./command";
import { readTask, triJson } from "./utils";

const program = new Command();

program
    .name(name.replace("Arnaud Derison", ""))
    .version(version)
    .description(description);

program
    .command("add")
    .description("add a task")
    .argument('<task>', "The task", verifTaskNotEmpty)
    .action(async (task) => {
        console.log(chalk.blue.bold("Task ID is: " + chalk.green(`${await addTask(task)}`)));
    });

program
    .command("delete")
    .description("delete a task")
    .argument('<id>', "The task ID", verifTaskId)
    .action(async (id) => {
        console.log("Delete task : " + `${await deleteTask(id)}`)
    });

program
    .command("list")
    .option("-a, --all", "Include done tasks")
    .description("list tasks")
    .action(async (options) => {

        const tasks = await writeList(options.all);

        const data = [[chalk.bold.cyan("ID"), chalk.bold.cyan("Task")]];
        triJson(tasks).map(task => {
            data.push([
                chalk.italic.bold(task.id),
                task.done ? chalk.green(task.task) : chalk.red(task.task)
            ]);
        });

        console.log(table(data));
    });

program
    .command("done")
    .description("Done a task")
    .argument('<id>', "The task ID", verifTaskId)
    .action(async (id) => {
        const isDoneOrUndone = await doneAndUndoneTask(id, true);
        isDoneOrUndone === -1 && program.error(chalk.red.bold("An error occurred while done the tasks"));
    });

program
    .command("undone")
    .description("Undone a task")
    .argument('<id>', "The task ID", verifTaskId)
    .action(async (id) => {
        const isDoneOrUndone = await doneAndUndoneTask(id, false);
        isDoneOrUndone === -1 && program.error(chalk.red.bold("An error occurred while undone the tasks"));
    });

program
    .command("reset")
    .description("reset tasks")
    .action(async () => {
        try {
            await readTask(DEFAULT_FILENAME, true);

        } catch (err) {
            program.error(chalk.red.bold("An error occurred while reset the tasks"))
        }
    });
program
    .command("swap")
    .description("swap task")
    .argument('<id1>', "First task id", verifTaskId)
    .argument("<id2>", "second task id", verifTaskId)
    .action(async (id1, id2) => {
        try {
            await swapTasks(id1, id2);

        } catch (err) {
            program.error(chalk.red.bold("An error occurred while reset the tasks"))
        }
    });

function verifTaskNotEmpty(task: string): string {
    if (task === "") {
        throw new InvalidArgumentError(chalk.red.bold('The task cannot be empty'))
    }
    return task;
}

function verifTaskId(value: string): number {
    const id = parseInt(value, 10);

    if (isNaN(id)) {
        throw new InvalidArgumentError(chalk.red.bold('The task id in not valid'));
    }
    return id;
}

program.parse();
program.showHelpAfterError();