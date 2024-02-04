import { GraphQLError } from "graphql";
import { PubSub, withFilter } from "graphql-subscriptions";
import { 
    getMessages, createMessage, 
    getCoffees, createCoffee, 
    getCheckins,createCheckin,
    getToasts, createToast,
    getComments, createComment
} from "../models/mongo/index.js";

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
            return await getCheckins() || [];
        },
        toasts: async (_root, { checkinId }, { user }) => {
            if (!user) throw unauthorizedError();
            return await getToasts(checkinId) || [];
        },
        comments: async (_root, { checkinId }, { user }) => {
            if (!user) throw unauthorizedError();
            return await getComments(checkinId) || [];
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
            const createResponse = await createCheckin(user.uid, input);
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
        },
        addToast: async (_root, { input }, { user }) => {
            if (!user) throw unauthorizedError();
            const createResponse = await createToast(user.uid, input);
            if (!(await createResponse.ok)) throw createError(createResponse);
            console.log('[addToast] Toast Added!')
            pubSub.publish('TOAST_ADDED', { toastAdded: createResponse.toast });
            return await createResponse.toast;
        },
        addComment: async (_root, { input }, { user }) => {
            if (!user) throw unauthorizedError();
            const createResponse = await createComment(user.uid, input);
            if (!(await createResponse.ok)) throw createError(createResponse);
            pubSub.publish('COMMENT_ADDED', { commentAdded: createResponse.comment });
            return await createResponse.comment;
        },
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
        },
        toastAdded: {
            subscribe: withFilter(
                (_root, _args, { user }) => {
                    if (!user) throw unauthorizedError();
                    console.log('[toastAdded] TOAST_ADDED!')
                    return pubSub.asyncIterator('TOAST_ADDED')
                },
                (payload, variables) => {
                    return Number(payload.toastAdded.checkinId) === Number(variables.checkinId);
                }
            )
        },
        commentAdded: {
            subscribe: withFilter(
                (_root, _args, { user }) => {
                    if (!user) throw unauthorizedError();
                    return pubSub.asyncIterator('COMMENT_ADDED')
                },
                (payload, variables) => {
                    return Number(payload.commentAdded.checkinId) === Number(variables.checkinId);
                }
            )
        },
    }
}

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