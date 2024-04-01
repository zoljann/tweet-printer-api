import * as express from 'express';
import { Express } from 'express';
import * as cors from 'cors';
import { connect } from 'mongoose';
import imageRoute from './routes/imageRoute';
import orderRoute from './routes/orderRoute';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/order', orderRoute);
app.use('/image', imageRoute);

connect('mongodb://127.0.0.1:27017/twitterprint')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error: string) => {
    console.error('Failed to connect to MongoDB:', error);
  });
