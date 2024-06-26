import cors from 'cors';
import path from 'path';
import express from 'express';
import { authMiddleware, handleLogin } from './auth.js';
import { apolloMiddleware, __dirname } from './apollo.server.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.post('/login', handleLogin);

app.use('/v1', authMiddleware, apolloMiddleware);

export default app;