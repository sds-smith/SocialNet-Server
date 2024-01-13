import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { getMessages, createMessage } from "../models/mongo/index.js";
import { getCheckins } from "../models/mock-data.model.js";

const pubSub = new PubSub();

export const resolvers = {
    Query: {
        messages: async (_root, _args, { user }) => { 
            if (!user) throw unauthorizedError();
            return await getMessages() || [];
        },
        checkins: async (_root, _args, { user }) => { 
            if (!user) throw unauthorizedError();
            return await getCheckins() || [];
        }
    },

    Mutation: {
        addMessage: async (_root, { text }, { user }) => {
            if (!user) throw unauthorizedError();
            const createResponse = await createMessage(user, text);
            if (!(await createResponse.ok)) throw createError(createResponse);
            pubSub.publish('MESSAGE_ADDED', { messageAdded: createResponse.message});
            return await createResponse.message;
        },
        // addCheckin: async (_root, { checkin }, { user }) => {
        //     if (!user) throw unauthorizedError();
        //     const createResponse = await createCheckin(user, checkin);
        //     if (!(await createResponse.ok)) throw createError(createResponse);
        //     // pubSub.publish('MESSAGE_ADDED', { messageAdded: createResponse.message});
        //     return await createResponse.message;
        // }
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