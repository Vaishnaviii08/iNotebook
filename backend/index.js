import connectToMongo from './db.js';
import express from 'express';
import authRouter from './routes/auth.js';
import notesRouter from './routes/notes.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

console.log("MONGO_URI is:", process.env.MONGO_URI);

const port = process.env.PORT || 5000;

connectToMongo();

const app = express();

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