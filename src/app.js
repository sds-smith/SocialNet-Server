import cors from 'cors';
import path from 'path';
import express from 'express';
import { apolloMiddleware, __dirname } from './apollo.server.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.post('/login', handleLogin);

// app.use('/', (req, res) => {
//     return res.status(200).json('hello from the backend')
// })

app.use('/graphql', apolloMiddleware);

export default app;