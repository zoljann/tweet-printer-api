import { Router } from 'express';
import {
  createOrder,
  completePaypalOrder,
} from '../controllers/orderController';

const router = Router();

router.post('/create', createOrder);
router.post('/complete-paypal-order', completePaypalOrder);

export default router;
