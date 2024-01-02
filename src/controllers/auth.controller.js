import path from 'path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersPath = path.join(__dirname, '../models/auth.model.json')
export const getUser = async (username) => {
    const users = JSON.parse(await readFile(usersPath, 'utf8'));
    return users[username]
}