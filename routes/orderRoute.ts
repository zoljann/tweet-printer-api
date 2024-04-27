import { Router } from 'express';
import { createOrder } from '../controllers/orderController';

const router = Router();

router.post('/create', createOrder);

export default router;
