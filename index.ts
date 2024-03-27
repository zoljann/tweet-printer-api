import * as express from 'express';
import { Express } from 'express';
import order from './controllers/order';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use('/order', order); //localhost:3000/order/get-orders

app.listen(port);
