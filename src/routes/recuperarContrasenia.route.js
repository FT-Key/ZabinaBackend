import express from 'express';
import { recuperarContraseniaController, nuevaContraseniaController } from '../controllers/recuperarContrasenia.controller.js';
import { resetPasswordLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

router.post('/', recuperarContraseniaController);
router.post('/nuevaContrasenia', resetPasswordLimiter, nuevaContraseniaController);

export default router;