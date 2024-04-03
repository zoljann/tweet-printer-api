import express from 'express';
import { Express } from 'express';
import cors from 'cors';
import imageRoute from './routes/imageRoute';
import orderRoute from './routes/orderRoute';

const mongoose = require('mongoose');
const app: Express = express();
const port = process.env.PORT || 3000;
const mongoDbURI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/twitterprint';

app.use(cors());
app.use(express.json());

app.use('/order', orderRoute);
app.use('/image', imageRoute);

mongoose
  .connect(mongoDbURI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error: string) => {
    console.error('Failed to connect to MongoDB:', error);
  });
