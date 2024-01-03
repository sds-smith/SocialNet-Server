import { getMessages } from "../models/messages.model.js";


const resolvers = {
    Query: {
        greeting: (_root, _args, { message }) => message,
        messages: (_root, _args, _context) => getMessages()
    }
}

export { resolvers };