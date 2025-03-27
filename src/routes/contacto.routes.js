import { Router } from 'express';
import { postContactoController, postDonationController } from '../controllers/contacto.controller.js';

const router = Router();

router.post('/donation', postDonationController);
router.post('/', postContactoController);

export default router;