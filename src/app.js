import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', (req, res) => {
    return res.status(200).json('hello from the backend')
})

export default app;