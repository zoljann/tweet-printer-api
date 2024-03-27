import { Router } from 'express';
import { Schema, model } from 'mongoose';

const router = Router();

interface IOrder {
  name: string;
  mobileNumber: number,
  items: string,
}

const orderSchema = new Schema<IOrder>({
  name: { type: String, required: true },
  mobileNumber: { type: Number, required: true },
  items: { type: String, required: true },
})

const Order = model<IOrder>('Order', orderSchema);

router.get('/get-orders', function (req, res) {
  res.json({ id: 1, product: 'Product 1', quantity: 5 });
});

router.post('/create-order', function (req, res) {
  const newOrder = new Order({
    name: req.body.name,
    mobileNumber: req.body.mobileNumber,
    items: req.body.items,
  });

  console.log(newOrder);
});

export default router;
