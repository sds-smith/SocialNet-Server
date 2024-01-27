import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { getMessages, createMessage, getCoffees, createCoffee, createCheckin, getCheckins } from "../models/mongo/index.js";

const pubSub = new PubSub();

export const resolvers = {
    Query: {
        messages: async (_root, _args, { user }) => { 
            if (!user) throw unauthorizedError();
            return await getMessages() || [];
        },
        coffees: async (_root, _args, { user }) => { 
            if (!user) throw unauthorizedError();
            const coffees = await getCoffees() || {};
            return Object.values(coffees)
        },
        checkins: async (_root, _args, { user }) => { 
            if (!user) throw unauthorizedError();
            const checkins = await getCheckins()
            console.log('checkins', checkins)
            return await getCheckins() || [];
        }
    },

    Mutation: {
        addMessage: async (_root, { text }, { user }) => {
            if (!user) throw unauthorizedError();
            const createResponse = await createMessage(user.displayName, text);
            if (!(await createResponse.ok)) throw createError(createResponse);
            pubSub.publish('MESSAGE_ADDED', { messageAdded: createResponse.message});
            return await createResponse.message;
        },
        addCheckin: async (_root, { input }, { user }) => {
            if (!user) throw unauthorizedError();
            const createResponse = await createCheckin(user.email, input);
            if (!(await createResponse.ok)) throw createError(createResponse);
            pubSub.publish('CHECKIN_ADDED', { checkinAdded: createResponse.checkin});
            return await createResponse.checkin;
        },
        addCoffee: async (_root, { input }, { user }) => {
            if (!user) throw unauthorizedError();
            const createResponse = await createCoffee(input);
            if (!(await createResponse.ok)) throw createError(createResponse);
            pubSub.publish('COFFEE_ADDED', { coffeeAdded: createResponse.coffee});
            return await createResponse.coffee;
        }
    },

    Subscription: {
        messageAdded: {
            subscribe: (_root, _args, { user }) => {
                if (!user) throw unauthorizedError();
                return pubSub.asyncIterator('MESSAGE_ADDED')
            }
        },
        checkinAdded: {
            subscribe: (_root, _args, { user }) => {
                if (!user) throw unauthorizedError();
                return pubSub.asyncIterator('CHECKIN_ADDED')
            }
        },
        coffeeAdded: {
            subscribe: (_root, _args, { user }) => {
                if (!user) throw unauthorizedError();
                return pubSub.asyncIterator('COFFEE_ADDED')
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