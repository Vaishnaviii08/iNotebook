import connectToMongo from './db.js';
import express from 'express';
import authRouter from './routes/auth.js';
import notesRouter from './routes/notes.js';
import cors from 'cors';

connectToMongo();

const app = express();
const port = 5000;

app.use(cors());

app.use(express.json());

//Available routes
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter); // Fixed missing slash

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`);
});