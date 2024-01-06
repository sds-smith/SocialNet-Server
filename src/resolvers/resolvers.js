import { GraphQLError } from "graphql";
import { getMessages, createMessage } from "../models/messages.model.js";

export const resolvers = {
    Query: {
        greeting: (_root, _args, { message }) => message,
        messages: (_root, _args, { user }) => { 
            if (!user) throw unauthorizedError();
            return getMessages() ;
        }
    },

    Mutation: {
        addMessage: async (_root, { text }, { user }) => {
            if (!user) throw unauthorizedError();
            const message = await createMessage(user, text);
            return message;
        }
    }
};

function unauthorizedError() {
    return new GraphQLError('Not authenticated', {
        extensions: { code: 'UNAUTHORIZED'}
    });
};