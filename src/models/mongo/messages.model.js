import { messages } from './messages.mongo.js';

const DEFAULT_ID = 0;

export async function getMessages() {
    return await messages.find({}); 
}

async function getNextMessageId() {
    const latestMessage = await messages
        .findOne()
        .sort('-id')
    if (!latestMessage) {
        return DEFAULT_ID
    }
    return latestMessage.id + 1
}

export async function createMessage(user, text) {
    const nextId = await getNextMessageId();
    const message = {
        id: nextId,
        user,
        text,
        createdAt: Date.now()
    };
    const newMessage = new messages(message)
    try {
        const messageResponse = await newMessage.save();
        return {
            ok: true,
            status: 201,
            message: messageResponse
        }
    } catch(err) {
        console.log(err)
        return err
    };
}