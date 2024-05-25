import { Router } from 'express';
import {
  createOrder,
  completePaypalOrder,
  getAllOrders,
  updateStatusByOrderId,
  cancelPaypalOrder,
} from '../controllers/orderController';

const router = Router();

router.get('/get-all', getAllOrders);
router.post('/create', createOrder);
router.patch('/update-status', updateStatusByOrderId);
router.post('/complete-paypal-order', completePaypalOrder);
router.post('/cancel-paypal-order', cancelPaypalOrder);

export default router;
