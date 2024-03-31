import { Router } from 'express';
import { generateProductImagePreview } from '../controllers/imageController';

const router = Router();

router.get('/generate', generateProductImagePreview);

export default router;
