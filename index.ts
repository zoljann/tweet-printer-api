import express from 'express';
import { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import imageRoute from './routes/imageRoute';
import orderRoute from './routes/orderRoute';

dotenv.config();
const app: Express = express();
const port = process.env.PORT;
const mongoDbURI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

app.use('/order', orderRoute);
app.use('/image', imageRoute);

connect(mongoDbURI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error: string) => {
    console.error('Failed to connect to MongoDB:', error);
  });
