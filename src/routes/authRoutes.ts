import { Router } from 'express';
import { register, verifyQR,  } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/validate-qrcode', verifyQR);

export default router;
