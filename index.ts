import express from 'express';
import nodemailer from 'nodemailer';
import { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import imageRoute from './routes/imageRoute';
import orderRoute from './routes/orderRoute';
import productRoute from './routes/productRoute';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

dotenv.config();
const app: Express = express();
const port = process.env.PORT;
const mongoDbURI = process.env.MONGODB_URI;
const swaggerDocument = YAML.load('./swagger.yaml');
let transporter;

app.use(cors());
app.use(express.json());

app.use('/order', orderRoute);
app.use('/image', imageRoute);
app.use('/product', productRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connect(mongoDbURI)
  .then(() => {
    console.log('Connected to MongoDB');

    transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

export { transporter };
