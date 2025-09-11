import { Router } from 'express';
import { exportPins, generatePins, getAttendees, getUsers, login, register, verifyQR,  } from '../controllers/authController';
import { verifyJWT } from '@/middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/register', register); 
router.post('/verify', verifyJWT('scanner'), verifyQR);
router.get('/users', verifyJWT('admin'), getUsers);
router.get('/attendance', verifyJWT('admin'), getAttendees);
router.get('/export-pins', verifyJWT('admin'), exportPins);
router.post('/generate-pins', verifyJWT('admin'), generatePins);

export default router;