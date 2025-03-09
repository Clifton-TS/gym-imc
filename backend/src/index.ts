import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { AppDataSource } from './data-source';
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import evaluationRoutes from "./routes/evaluationRoutes";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/evaluations", evaluationRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

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
