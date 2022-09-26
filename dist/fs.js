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
Object.defineProperty(exports, "__esModule", { value: true });
exports.readUsersFile = exports.writeUsersFile = void 0;
const promises_1 = require("fs/promises");
const _1 = require(".");
const writeUsersFile = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, promises_1.writeFile)(_1.DATABASE_USERS, JSON.stringify(data));
    return null;
});
exports.writeUsersFile = writeUsersFile;
const readUsersFile = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = (yield (0, promises_1.readFile)(_1.DATABASE_USERS)).toString();
        return users;
    }
    catch (error) {
        yield (0, exports.writeUsersFile)([]);
        return '[]';
    }
});
exports.readUsersFile = readUsersFile;
