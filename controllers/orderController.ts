import { Request, Response } from 'express';
import { Schema, model } from 'mongoose';
import { IOrder } from '../interface';
import {
  calculateTotalPrice,
  sendConfirmationMail,
  sendConfirmationMailToEmployee,
} from '../helpers';

const orderSchema = new Schema<IOrder>(
  {
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    shipping: { type: String, required: true },
    status: { type: String, required: false },
    email: { type: String, required: true },
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    items: [],
  },
  { versionKey: false }
);

const Order = model<IOrder>('Order', orderSchema);

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();

    res.json(orders.reverse());
  } catch (error) {
    console.log('Failed to get orders', error);
    res.status(500).json({ error: 'Neuspješno dohvaćanje narudžbi' });
  }
};

export const updateStatusByOrderId = async (req: Request, res: Response) => {
  const { orderId, status } = req.body;

  if (!['payinCreated', 'ordered', 'paid', 'done'].includes(status)) {
    return res.json({
      error: 'Status nije validan',
    });
  }

  try {
    const order = await Order.findOne({ _id: orderId });

    if (order) {
      order.status = status;
    }

    await order.save();

    res.json({
      success: `Izmjenjen status narudžbe ID: ${orderId}`,
    });
  } catch (error) {
    console.log('Failed to update order', error);
    res.json({ error: 'Neuspješno izmjenjivanje statusa narudžbe' });
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
    if (shipping === 'card') {
      console.log('hendlaj placanje karticama');
      console.log(req.body);

      return;
      res.json({
        status: 'Narudžba kreirana, čekanje plaćanja',
      });

      res.json({
        error: 'Plaćanje nije uspjelo, molimo pokušajte ponovo',
      });
    }

    const newOrder = new Order({
      name,
      mobileNumber,
      state,
      city,
      address,
      email,
      status: 'ordered',
      shipping,
      total: calculateTotalPrice(items, state),
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

    sendConfirmationMailToEmployee(
      'isprintajsvojtvit@gmail.com',
      items,
      name,
      mobileNumber,
      state,
      city,
      address
    );
  } catch (error) {
    console.log('Error creating new order', error);
    res.status(500).json({ error });
  }
};
