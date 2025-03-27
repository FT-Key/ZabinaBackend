import express from 'express';
import { loginController, closeLoginController } from '../controllers/login.controller.js';
import { authTokenAndRole } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', loginController);
router.put('/', authTokenAndRole(['cliente', 'admin']), closeLoginController);

export default router;