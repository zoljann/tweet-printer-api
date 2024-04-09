import { Request, Response } from 'express';
import { Schema, model } from 'mongoose';
import { IOrder } from '../interface';
import { calculateTotalPrice } from '../helpers';
import { transporter } from '../index';

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

    if (email) {
      await transporter.sendMail({
        from: 'isprintajsvojtvit@gmail.com',
        to: email,
        subject: 'Potvrda narudžbe - @isprintajsvojtvit',
        text: 'saljemo vam potvrdu narudzbe',
        html: '<b>sta ovo bold</b> </br> radil novi red da nastavim ovdje',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
