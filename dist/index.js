"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_USERS = void 0;
const fs_1 = require("fs");
const commander_1 = require("commander");
const process_1 = require("process");
const chalk_1 = __importDefault(require("chalk"));
const prompts_1 = __importDefault(require("prompts"));
const fs_2 = require("./fs");
exports.DATABASE_USERS = "users.json";
class User {
    constructor({ name, age }) {
        this.ID = JSON.parse((0, fs_1.readFileSync)(exports.DATABASE_USERS).toString()).length + 1;
        this.name = name;
        this.age = age;
    }
}
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, fs_2.readUsersFile)();
    return JSON.parse(users);
});
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield getUsers();
    users.push(users);
    yield (0, fs_2.writeUsersFile)(users);
    return user;
});
const getUser = (ID) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getUsers();
    return user.find((user) => user.ID === ID);
});
const deleteUser = (ID) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getUsers();
    const userExist = user.find((user) => user.ID === ID);
    if (!userExist)
        throw 'User was not found';
    const newUsers = user.filter((user) => user.ID !== ID);
    yield (0, fs_2.writeUsersFile)(newUsers);
});
const updateUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield getUsers();
    const userExist = users.find((user) => user.ID === user.ID);
    const index = users.indexOf(userExist);
    users[index] = Object.assign({}, user);
    yield (0, fs_2.writeUsersFile)(users);
});
const cli = new commander_1.Command();
cli.name("nucba-node-1").description("CLI ejercicio");
cli
    .command("users")
    .description("Actions with the Users")
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    const { action } = yield (0, prompts_1.default)({
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
    });
    switch (action) {
        case 'C':
            const { name } = yield (0, prompts_1.default)({
                type: "text",
                name: "name",
                message: "Enter the user's name"
            });
            const { age } = yield (0, prompts_1.default)({
                type: "text",
                name: "age",
                message: "Enter the user's age"
            });
            yield createUser(new User({
                name,
                age
            }));
            return console.log(chalk_1.default.green("User created successfully!"));
        case 'R':
            const data = yield getUsers();
            return console.table(data);
        case 'U':
            try {
                const { ID } = yield (0, prompts_1.default)({
                    type: "number",
                    name: "ID",
                    message: "Enter the user's ID to updated"
                });
                const exist = yield getUser(ID);
                if (!exist)
                    throw 'User was not found';
                const { newName } = yield (0, prompts_1.default)({
                    type: "text",
                    name: "newName",
                    message: "Enter the user's name to updated"
                });
                const { newAge } = yield (0, prompts_1.default)({
                    type: "text",
                    name: "newAge",
                    message: "Enter the user's age to updated"
                });
                yield updateUser({ ID, name: newName, age: newAge });
                return console.log(chalk_1.default.green("User updated successfully!"));
            }
            catch (error) {
                return console.log(chalk_1.default.red(error));
            }
        case 'D':
            const { id } = yield (0, prompts_1.default)({
                type: "number",
                name: "id",
                message: "Enter the user's ID to deleted"
            });
            try {
                yield deleteUser(id);
                return console.log(chalk_1.default.green("User deleted successfully!"));
            }
            catch (error) {
                return console.log(chalk_1.default.red(error));
            }
        default:
            break;
    }
}));
cli.parse(process_1.argv);
