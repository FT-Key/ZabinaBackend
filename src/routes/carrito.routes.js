import express from 'express';
import {
  addProductToCartController,
  removeProductFromCartController,
  getCartController,
  buyProductsMPController
} from '../controllers/carrito.controllers.js';
import { authTokenAndRole } from '../middlewares/auth.js';

const router = express.Router();

router.post('/:idProducto', authTokenAndRole(['cliente', 'admin']), addProductToCartController);
router.delete('/:idProducto', authTokenAndRole(['cliente', 'admin']), removeProductFromCartController);
router.get('/', authTokenAndRole(['cliente', 'admin']), getCartController);
router.post('/comprarProductosMercadoPago', authTokenAndRole(['cliente', 'admin']), buyProductsMPController);

export default router;
