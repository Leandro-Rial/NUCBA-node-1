import { readFileSync } from 'fs';
import { Command } from "commander";
import { argv } from "process";
import chalk from "chalk";
import prompt from "prompts";
import { readUsersFile, writeUsersFile } from './fs';

export const DATABASE_USERS = "users.json";

interface ICreateUser {
    name: string;
    age: number;
}

class User {
    ID: number;
    name: string;
    age: number;

    constructor({ name, age }: ICreateUser) {
        this.ID = JSON.parse(readFileSync(DATABASE_USERS).toString()).length + 1;
        this.name = name;
        this.age = age;
    }
}

const getUsers = async () => {
    const users = await readUsersFile()
    return JSON.parse(users)
}

const createUser = async (user: User) => {
    const users = await getUsers();
    users.push(users);
    await writeUsersFile(users);
    return user
}

const getUser = async (ID: number) => {
    const user = await getUsers();
    return user.find((user: User) => user.ID === ID)
}

const deleteUser = async (ID: number) => {
    const user = await getUsers();
    const userExist = user.find((user: User) => user.ID === ID)
    if (!userExist) throw 'User was not found'
    const newUsers = user.filter((user: User) => user.ID !== ID)
    await writeUsersFile(newUsers);
}

const updateUser = async (user: User) => {
    const users = await getUsers();
    const userExist = users.find((user: User) => user.ID === user.ID)
    const index = users.indexOf(userExist)
    users[index] = { ...user }
    await writeUsersFile(users);
}

const cli = new Command();

cli.name("nucba-node-1").description("CLI ejercicio");

cli
  .command("users")
  .description("Actions with the Users")
  .action(async () => {
    const { action } = await prompt({
        type: "select",
        name: "action",
        message: "What do you want to do?",
        choices: [
            {
                title: "Add",
                value: "C"
            },
            {
                title: "Read",
                value: "R"
            },
            {
                title: "Update",
                value: "U"
            },
            {
                title: "Delete",
                value: "D"
            },
        ]
    })

    switch (action) {
        case 'C':
            
            const { name } = await prompt({
                type: "text",
                name: "name",
                message: "Enter the user's name"
            })
            const { age } = await prompt({
                type: "text",
                name: "age",
                message: "Enter the user's age"
            })

            await createUser(
                new User({
                    name,
                    age
                })
            )

            return console.log(chalk.green("User created successfully!"))

        case 'R':
            const data = await getUsers()
            return console.table(data)

        case 'U':
            try {
                const { ID } = await prompt({
                    type: "number",
                    name: "ID",
                    message: "Enter the user's ID to updated"
                })
                
                const exist = await getUser(ID)
                
                if (!exist) throw 'User was not found'
                
                const { newName } = await prompt({
                    type: "text",
                    name: "newName",
                    message: "Enter the user's name to updated"
                })
                
                const { newAge } = await prompt({
                    type: "text",
                    name: "newAge",
                    message: "Enter the user's age to updated"
                })
                
                await updateUser({ ID, name: newName, age: newAge })
                return console.log(chalk.green("User updated successfully!"))

            } catch (error) {
                return console.log(chalk.red(error))
            }

        case 'D':
            const { id } = await prompt({
                type: "number",
                name: "id",
                message: "Enter the user's ID to deleted"
            })

            try {
                await deleteUser(id)
                return console.log(chalk.green("User deleted successfully!"))
            } catch (error) {
                return console.log(chalk.red(error))
            }
    
        default:
            break;
    }
  });

cli.parse(argv);