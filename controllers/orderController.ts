import { Request, Response } from 'express';
import { Schema, model } from 'mongoose';
import { IOrder } from '../interface';

const orderSchema = new Schema<IOrder>(
  {
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    shipping: { type: String, required: true },
    items: [],
  },
  { versionKey: false }
);

const Order = model<IOrder>('Order', orderSchema);

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Neuspješno dohvaćanje narudžbi' });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const { name, mobileNumber, state, city, address, shipping, items } =
    req.body;

  if (
    !name ||
    !mobileNumber ||
    !state ||
    !city ||
    !address ||
    !shipping ||
    !items ||
    !items.every(
      (item: any) => 'product' in item && 'color' in item && 'tweetUrl' in item
    )
  ) {
    res.status(500).json({ error: 'Nepotpun unos' });

    return;
  }

  try {
    const newOrder = new Order({
      name,
      mobileNumber,
      items,
      state,
      city,
      address,
      shipping,
    });

    await newOrder.save();

    res.json({ success: 'Uspješno kreirana narudžba' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Neuspješno kreiranje narudžbe' });
  }
};
