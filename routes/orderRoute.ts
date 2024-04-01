import { Router } from 'express';
import { getAllOrders, createOrder } from '../controllers/orderController';

const router = Router();

router.get('/get-all', getAllOrders);
router.post('/create', createOrder);

export default router;
