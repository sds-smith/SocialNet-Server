import path from 'path';
import { fileURLToPath } from 'url';
import { ApolloServer } from '@apollo/server';
import { readFile } from 'node:fs/promises';
import { expressMiddleware } from '@apollo/server/express4';
import { resolvers } from './resolvers/resolvers.js';
import { makeExecutableSchema } from '@graphql-tools/schema';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, 'schema/schema.graphql')
const typeDefs = await readFile(schemaPath, 'utf8');
export const schema =  makeExecutableSchema({ typeDefs, resolvers });

async function getHttpContext({ req }) {
    if (req.auth) {
        return { 
            user: req.auth.sub,
            message: 'hello from graphql context'
        };
    };
    return {
      message: 'hello from graphql context'
    };
    // const token = req?.session?.client_token?.token;
    // const accessToken = req?.session?.passport?.user?.accessToken;
    // const id = req?.session?.passport?.user?.profile?.id;
    // return {
    //     token,
    //     accessToken,
    //     id
    // };
};

const apolloServer = new ApolloServer({ schema });
await apolloServer.start();
export const apolloMiddleware = expressMiddleware(apolloServer, { context: getHttpContext });
