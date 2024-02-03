import http from 'http';
import { useServer as useWsServer } from 'graphql-ws/lib/use/ws'
import { WebSocketServer } from 'ws';
import { mongoConnect } from './services/mongo.js';
import { schema } from './apollo.server.js';
import { decodeToken } from './auth.js';
import app from './app.js';

const PORT = process.env.PORT || 80;

async function getWsContext({ connectionParams }) {
    const accessToken = connectionParams?.accessToken;
    if (accessToken) {
        const payload = decodeToken(accessToken);
        return { user: payload.sub }
    };
    return {};
};

const httpServer = http.createServer(app);
const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });
useWsServer({ schema, context: getWsContext }, wsServer);

async function startServer() {
    await mongoConnect();
    
    httpServer.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}/v1`);
    });
};

startServer();