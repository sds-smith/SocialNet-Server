import http from 'http';

import { mongoConnect } from './services/mongo.js';
import app from './app.js';

const PORT = process.env.PORT || 80;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
};

startServer();