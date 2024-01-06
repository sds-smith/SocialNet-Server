import path from 'path';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'url';
import {generateId} from '../util/ids.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const messagesPath = path.join(__dirname, '../data/messages.data.json')

export const getMessages = async () => {
    const messages =  JSON.parse(await readFile(messagesPath, 'utf8'));

    return Object.values(messages)
};

export async function createMessage(user, text) {
    const message = {
        id: generateId(),
        user,
        text,
        createdAt: new Date().toISOString
    };
    const messages =  JSON.parse(await readFile(messagesPath, 'utf8'));
    const updatedMessages = {
        ...messages,
        [message.id]: message
    };
    await writeFile(messagesPath, JSON.stringify(updatedMessages));
    return Object.values(messages)
}