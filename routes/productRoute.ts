import { Router } from 'express';
import { getAllImages } from '../controllers/productController';

const router = Router();

router.get('/get-all-images', getAllImages);

export default router;
