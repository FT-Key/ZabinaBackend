import { Router } from 'express';
import { getProductosController, getProductoController, postProductoController, putProductoController, deleteProductoController, agregarImagenProductoController } from '../controllers/productos.controllers.js'
import upload from '../middlewares/multer.js';
import { authTokenAndRole } from '../middlewares/auth.js';
import { paginationMiddleware } from '../utils/pagination.js';
import ProductModel from '../models/producto.schema.js';
import dynamicFilterMiddleware from '../middlewares/filter.js';

const router = Router();

router.get('/', paginationMiddleware, dynamicFilterMiddleware(ProductModel), getProductosController);

router.get('/:idProducto', getProductoController);

router.post('/', authTokenAndRole('admin'), postProductoController);

router.put('/:idProducto', authTokenAndRole('admin'), putProductoController);

router.delete('/:idProducto', authTokenAndRole('admin'), deleteProductoController);

router.post('/agregarImagen/:idProducto', authTokenAndRole('admin'), upload.single('image'), agregarImagenProductoController);

export default router;