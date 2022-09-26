import { readFile, writeFile } from "fs/promises"
import { DATABASE_USERS } from "."

export const writeUsersFile = async (data: any) => {
    await writeFile(DATABASE_USERS, JSON.stringify(data))
    return null
}

export const readUsersFile = async () => {
    try {
        const users = (await readFile(DATABASE_USERS)).toString()
        return users
    } catch (error) {
        await writeUsersFile([]);
        return '[]'
    }
}