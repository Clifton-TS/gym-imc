import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './data-source';
import { User } from './entities/User';

const app = express();
const port = 3000;

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    app.get('/', async (req, res) => {
      res.send('Running');
    });

    app.get('/users', async (req, res) => {
      const users = await AppDataSource.getRepository(User).find();
      res.json(users);
    });

    app.post('/users', async (req, res) => {
      const user = await AppDataSource.getRepository(User).create(req.body);
      const result = await AppDataSource.getRepository(User).save(user);
      res.send(result);
    });

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
