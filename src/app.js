import cors from 'cors';
import path from 'path';
import express from 'express';
import { authMiddleware, handleLogin } from './auth.js';
import { apolloMiddleware, __dirname } from './apollo.server.js';

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'https://cup-coffee-social.netlify.app/']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/*', (_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", 'https://cup-coffee-social.netlify.app/');
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.post('/login', handleLogin);

app.use('/v1', authMiddleware, apolloMiddleware);

export default app;