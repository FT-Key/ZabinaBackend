import { Router } from 'express';
import {
  getAnimalsController,
  getAnimalController,
  postAnimalController,
  putAnimalController,
  deleteAnimalController,
  agregarFotoAnimalController,
  createAnimalController
} from '../controllers/animales.controllers.js';
import upload from '../middlewares/multer.js';
import { authTokenAndRole } from '../middlewares/auth.js';
import { paginationMiddleware } from '../utils/pagination.js';
import AnimalModel from '../models/animal.schema.js';
import dynamicFilterMiddleware from '../middlewares/filter.js';

const router = Router();

/* GET */
router.get('/', paginationMiddleware, dynamicFilterMiddleware(AnimalModel), getAnimalsController);

/* GET con parametro */
router.get('/:idAnimal', getAnimalController);

/* POST */
router.post('/createAnimal', authTokenAndRole(['admin', 'cliente']), createAnimalController);
router.post('/', authTokenAndRole(['admin', 'cliente']), postAnimalController);

/* PUT */
router.put('/:idAnimal', authTokenAndRole(['admin', 'cliente']), putAnimalController);

/* DELETE */
router.delete('/:idAnimal', authTokenAndRole(['admin', 'cliente']), deleteAnimalController);

/* SUBIR FOTO DE ANIMAL*/
router.post('/agregarFotoAnimal/:idAnimal', authTokenAndRole(['admin', 'cliente']), upload.single('image'), agregarFotoAnimalController);

export default router;