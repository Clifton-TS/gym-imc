import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from "cors";
import { AppDataSource } from './data-source';
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import evaluationRoutes from "./routes/evaluationRoutes";

import dotenv from 'dotenv';
import createDefaultUsers from './initializeDatabase';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/evaluations", evaluationRoutes);

AppDataSource.initialize()
  .then(async () => {
    console.log('Data Source has been initialized!');

    await createDefaultUsers();

    app.get('/', async (req: Request, res: Response) => {
      res.send('Running');
    });

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
