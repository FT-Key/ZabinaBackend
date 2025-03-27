import express from 'express';
import {
  addProductToFavController,
  removeProductFromFavController,
  getFavController
} from '../controllers/favoritos.controllers.js';
import { authTokenAndRole } from '../middlewares/auth.js';

const router = express.Router();

router.post('/:idProducto', authTokenAndRole(['cliente', 'admin']), addProductToFavController);
router.delete('/:idProducto', authTokenAndRole(['cliente', 'admin']), removeProductFromFavController);
router.get('/', authTokenAndRole(['cliente', 'admin']), getFavController);

export default router;
