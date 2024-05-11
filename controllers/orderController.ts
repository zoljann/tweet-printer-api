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
  sendConfirmationMailToEmployeePaypal,
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
    items: [],
  },
  { versionKey: false }
);

const Order = model<IOrder>('Order', orderSchema);

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
          status: 'unpaid',
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
          success: 'Narudžba uspješno plaćena, uskoro je na vašoj adresi',
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

        sendConfirmationMailToEmployeePaypal(
          'isprintajsvojtvit@gmail.com',
          order.items,
          order.name,
          order.mobileNumber,
          order.state,
          order.city,
          order.address,
          order.status,
          order._id
        );
      }
    } else {
      res.json({
        error: 'Plaćanje nije uspješno, pokušaj ponovo',
      });
      console.log('Completing order error: ', orderId);
    }
  } catch (error) {
    console.log('Erorr completing paypal order', error.code);
    return { error: true };
  }
};
