import * as express from 'express';
import { Express } from 'express';
import * as cors from 'cors';
import { connect } from 'mongoose';
import order from './controllers/order';
import image from './controllers/image';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/order', order); 
app.use('/image', image); 

connect('mongodb://127.0.0.1:27017')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error: string) => {
    console.error('Failed to connect to MongoDB:', error);
  });
