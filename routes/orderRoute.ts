import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  updateStatusByOrderId,
} from '../controllers/orderController';

const router = Router();

router.get('/get-all', getAllOrders);
router.post('/create', createOrder);
router.patch('/update-status', updateStatusByOrderId);

export default router;
