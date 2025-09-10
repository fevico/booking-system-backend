import { Router } from 'express';
import { exportPins, getAttendees, getUsers, register, verifyQR,  } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/validate-qrcode', verifyQR);
router.get('/export-pins', exportPins);
router.get('/attendance', getAttendees);
router.get('/users', getUsers); 

export default router;
