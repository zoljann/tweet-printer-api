const express = require('express');
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const order = require('./controllers/order.js');

app.use('/order', order); //localhost:3000/order/get-orders

app.listen(3000);