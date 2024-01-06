import path from 'path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const messagesPath = path.join(__dirname, '../data/messages.data.json')

export const getMessages = async () => {
    const messages =  JSON.parse(await readFile(messagesPath, 'utf8'));

    return Object.values(messages)
}