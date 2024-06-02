import { Router } from 'express';
import {
  createOrder,
  completePaypalOrder,
  getAllOrders,
  updateOrderById,
  cancelPaypalOrder,
} from '../controllers/orderController';

const router = Router();

router.get('/get-all', getAllOrders);
router.post('/create', createOrder);
router.patch('/update', updateOrderById);
router.post('/complete-paypal-order', completePaypalOrder);
router.post('/cancel-paypal-order', cancelPaypalOrder);

export default router;
