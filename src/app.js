import cors from 'cors';
import path from 'path';
import express from 'express';
import { authMiddleware, handleLogin, handleGoogleLogin } from './auth.js';
import { apolloMiddleware, __dirname } from './apollo.server.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.post('/login', handleLogin);
app.post('/googleLogin', handleGoogleLogin);

app.use('/graphql', authMiddleware, apolloMiddleware);

export default app;