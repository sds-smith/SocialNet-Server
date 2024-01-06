import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { getMessages, createMessage } from "../models/mongo/index.js";

const pubSub = new PubSub();

export const resolvers = {
    Query: {
        greeting: (_root, _args, { message }) => message,
        messages: (_root, _args, { user }) => { 
            if (!user) throw unauthorizedError();
            return getMessages();
        }
    },

    Mutation: {
        addMessage: async (_root, { text }, { user }) => {
            if (!user) throw unauthorizedError();
            const createResponse = await createMessage(user, text);
            if (!(await createResponse.ok)) throw createError(createResponse);
            return await createResponse.message;
        }
    },

    Subscription: {
        messageAdded: {
            subscribe: (_root, _args, { user }) => {
                if (!user) throw unauthorizedError();
                return pubSub.asyncIterator('MESSAGE_ADDED')
            }
        }
    }
};

function unauthorizedError() {
    return new GraphQLError('Not authenticated', {
        extensions: { code: 'UNAUTHORIZED'}
    });
};

function createError(err) {
    return new GraphQLError(`Message not added. Error: ${err}`, {
        extensions: { code: 'MONGO_ERR'}
    });
};