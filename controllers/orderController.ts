import { Schema, model } from 'mongoose';

interface IOrder {
  name: string;
  mobileNumber: number;
  items: string;
}

const orderSchema = new Schema<IOrder>({
  name: { type: String, required: true },
  mobileNumber: { type: Number, required: true },
  items: { type: String, required: true },
});

const Order = model<IOrder>('Order', orderSchema);

export const getAllOrders = async (req: any, res: any) => {
  res.json({ id: 1, product: 'Product 1', quantity: 5 });
};

export const createOrder = async (req: any, res: any) => {
  const newOrder = new Order({
    name: req.body.name,
    mobileNumber: req.body.mobileNumber,
    items: req.body.items,
  });

  console.log(newOrder);
};
