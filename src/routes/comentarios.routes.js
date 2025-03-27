import { Router } from 'express';
import {
  getComentariosController,
  postComentarioController,
  deleteComentarioController,
} from '../controllers/comentarios.controller.js';
import { authTokenAndRole } from '../middlewares/auth.js';
import { paginationMiddleware } from '../utils/pagination.js';
import dynamicFilterMiddleware from '../middlewares/filter.js';
import ComentarioModel from '../models/comentarios.schema.js';
const router = Router();

/* GET */
router.get('/', paginationMiddleware, dynamicFilterMiddleware(ComentarioModel), getComentariosController);

/* POST */
router.post('/', postComentarioController);

/* DELETE */
router.delete('/:idComentario', authTokenAndRole(['admin']), deleteComentarioController);

export default router;