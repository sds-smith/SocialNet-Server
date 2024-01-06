import { GraphQLError } from "graphql";
import { getMessages } from "../models/messages.model.js";

export const resolvers = {
    Query: {
        greeting: (_root, _args, { message }) => message,
        messages: (_root, _args, { user }) => { 
            if (!user) throw unauthorizedError();
            return getMessages() ;
        }
    }
};

function unauthorizedError() {
    return new GraphQLError('Not authenticated', {
        extensions: { code: 'UNAUTHORIZED'}
    });
};