import { Router } from 'express';
import { getUsuario, getUsuarios, postUsuario, putUsuario, deleteUsuario, agregarFotoPerfilController } from '../controllers/usuarios.controllers.js'
import upload from '../middlewares/multer.js';
import { authTokenAndRole } from '../middlewares/auth.js';
import { paginationMiddleware } from '../utils/pagination.js';
import UserModel from '../models/usuario.schema.js';
import dynamicFilterMiddleware from '../middlewares/filter.js';

const router = Router();

/* GET */
router.get('/', authTokenAndRole(['admin']), paginationMiddleware, dynamicFilterMiddleware(UserModel), getUsuarios);

/* GET con parametro */
router.get('/:idUsuario', authTokenAndRole(['admin']), getUsuario);

/* POST */
router.post('/', postUsuario);

/* PUT */
router.put('/:idUsuario', authTokenAndRole(['admin', 'cliente']), putUsuario);

/* DELETE */
router.delete('/:idUsuario', authTokenAndRole(['admin']), deleteUsuario);

/* SUBIR FOTO DE PERFIL*/
router.post('/agregarFotoPerfil/:idUsuario', upload.single('image'), agregarFotoPerfilController);

export default router;