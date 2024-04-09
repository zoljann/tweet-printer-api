import { Request, Response } from 'express';
import { Schema, model } from 'mongoose';
import { IOrder } from '../interface';
import { calculateTotalPrice, sendConfirmationMail } from '../helpers';

const orderSchema = new Schema<IOrder>(
  {
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    shipping: { type: String, required: true },
    email: { type: String, required: false },
    total: { type: Number, required: true },
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
  const { name, mobileNumber, state, city, address, shipping, email, items } =
    req.body;

  if (
    !name ||
    !mobileNumber ||
    !state ||
    !city ||
    !address ||
    !shipping ||
    !email ||
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
      state,
      city,
      address,
      shipping,
      total: calculateTotalPrice(items),
      items,
    });

    await newOrder.save();

    res.json({ success: 'Uspješno kreirana narudžba' });

    sendConfirmationMail(
      email,
      items,
      name,
      mobileNumber,
      state,
      city,
      address
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
