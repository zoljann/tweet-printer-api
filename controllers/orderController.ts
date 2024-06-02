import { Request, Response } from 'express';
import { Schema, model } from 'mongoose';
import { IOrder } from '../interface';
import {
  calculateTotalPrice,
  createPaypalOrder,
  generatePaypalAccessToken,
  sendConfirmationMail,
  sendConfirmationMailPaypal,
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
    payer: { type: Object, required: false },
    paypalOrderId: { type: String, required: false },
    email: { type: String, required: true },
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    note: { type: String, required: false },
    items: [],
  },
  { versionKey: false }
);

const Order = model<IOrder>('Order', orderSchema);

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / pageSize);

    res.json({
      orders,
      currentPage: page,
      totalPages,
      totalOrders,
    });
  } catch (error) {
    console.log('Failed to get orders', error);
    res.status(500).json({ error: 'Neuspješno dohvaćanje narudžbi' });
  }
};

export const updateOrderById = async (req: Request, res: Response) => {
  const { orderId, status, note } = req.body;

  if (
    !['ordered', 'paid', 'done', 'cancelled', 'sent', 'payinCreated'].includes(
      status
    )
  ) {
    return res.json({
      error: 'Status nije validan',
    });
  }

  try {
    const order = await Order.findOne({ _id: orderId });

    if (order) {
      order.status = status;

      if (note) {
        order.note = note;
      }
    }

    await order.save();

    res.json({
      success: `Izmjenjena narudžba, osoba: ${order.name}`,
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
    if (shipping === 'paypal') {
      const { paypalOrderCreated, orderId } = await createPaypalOrder(
        calculateTotalPrice(items, state)
      );

      if (paypalOrderCreated && orderId) {
        res.json({
          paypalPending: 'Narudžba kreirana, čekanje plaćanja',
          orderId: orderId,
        });

        const newOrder = new Order({
          name,
          mobileNumber,
          state,
          city,
          address,
          shipping,
          total: calculateTotalPrice(items, state),
          items,
          email,
          status: 'payinCreated',
          paypalOrderId: orderId,
        });

        await newOrder.save();
        return;
      } else {
        return res.json({
          error: 'Plaćanje nije uspjelo, molimo pokušajte ponovo',
        });
      }
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

export const completePaypalOrder = async (req: Request, res: Response) => {
  const { orderId } = req.body;
  const accessToken = await generatePaypalAccessToken();

  try {
    const response = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    let status = await response.json();

    if (status.status === 'COMPLETED') {
      const order = await Order.findOne({ paypalOrderId: orderId });

      if (order) {
        order.status = 'paid';
        order.payer = status.payer;

        await order.save();

        res.json({
          success: 'Narudžba je uspješno kreirana',
        });

        sendConfirmationMailPaypal(
          order.email,
          order.items,
          order.name,
          order.mobileNumber,
          order.state,
          order.city,
          order.address
        );

        sendConfirmationMailToEmployee(
          'isprintajsvojtvit@gmail.com',
          order.items,
          order.name,
          order.mobileNumber,
          order.state,
          order.city,
          order.address
        );
      }
    } else {
      res.json({
        error: 'Plaćanje nije uspješno, pokušaj ponovo',
      });
      console.log('Completing order error: ', orderId, 'status:', status);
    }
  } catch (error) {
    console.log('Erorr completing paypal order', error.code);
    return { error: true };
  }
};

export const cancelPaypalOrder = async (req: Request, res: Response) => {
  const { paypalOrderId } = req.body;

  try {
    const result = await Order.deleteOne({ paypalOrderId: paypalOrderId });

    if (result.deletedCount === 1) {
      res.json({
        success: `Obrisana paypal narudžba sa IDom: ${paypalOrderId}`,
      });
    } else {
      res.status(404).json({ error: 'Narudžba sa tim IDom nije pronađena' });
    }
  } catch (error) {
    console.log('Erorr canceling paypal order', error.code);
    res.status(500).json({ error });
  }
};
