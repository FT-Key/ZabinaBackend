import express from 'express';
import {
  addProductToCartController,
  removeProductFromCartController,
  getCartController,
  addProductToFavController,
  removeProductFromFavController,
  getFavController,
  buyProductsMPController
} from '../controllers/favncart.controllers.js';
import { authTokenAndRole } from '../middlewares/auth.js';

const router = express.Router();

// Rutas para el carrito
router.post('/carrito/agregar/:idProducto', authTokenAndRole(['cliente', 'admin']), addProductToCartController);
router.delete('/carrito/quitar/:idProducto', authTokenAndRole(['cliente', 'admin']), removeProductFromCartController);
router.get('/carrito', authTokenAndRole(['cliente', 'admin']), getCartController);
router.post('/carrito/comprarProductosMercadoPago', authTokenAndRole(['cliente', 'admin']), buyProductsMPController);

// Rutas para los favoritos
router.post('/fav/agregar/:idProducto', authTokenAndRole(['cliente', 'admin']), addProductToFavController);
router.delete('/fav/quitar/:idProducto', authTokenAndRole(['cliente', 'admin']), removeProductFromFavController);
router.get('/fav', authTokenAndRole(['cliente', 'admin']), getFavController);

export default router;