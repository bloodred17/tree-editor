/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import * as mongoose from 'mongoose';
import * as process from 'node:process';
import 'dotenv/config';
import { categoryApi } from './category/api';

mongoose
  .connect(process.env.MONGODB_ENDPOINT + 'store')
  .then(async (client) => {
    const connection = await client.connection.asPromise();
    const mongodbClient = connection.getClient();
    console.log('Connected to MongoDB');

    const app = express();

    app.use('/assets', express.static(path.join(__dirname, 'assets')));
    app.use(express.json());

    app.get('/api', (req, res) => {
      res.send({ message: 'Welcome to store!' });
    });

    app.use((req, res, next) => {
      req['client'] = mongodbClient;
      req['db'] = mongodbClient.db('store');
      next();
    });
    app.use('/api/category', categoryApi);

    const port = process.env.PORT || 3333;
    let server;

    server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
    });
    server.on('error', console.error);
  });
