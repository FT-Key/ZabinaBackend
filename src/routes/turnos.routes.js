import express from 'express';
import { crearTurnosSemanalesController, obtenerTurnosController, solicitarTurnoController, listaTurnosController, cancelarTurnoController, modificarTurnoController, obtenerTurnoController } from '../controllers/turnos.controller.js';
import { authTokenAndRole } from '../middlewares/auth.js';
import { paginationMiddleware } from '../utils/pagination.js';
import FechaTurnoModel from '../models/fechaTurnos.schema.js';
import dynamicFilterMiddleware from '../middlewares/filter.js';

const router = express.Router();

router.get('/', authTokenAndRole(['cliente', 'admin']), paginationMiddleware, dynamicFilterMiddleware(FechaTurnoModel), obtenerTurnosController);

router.get('/:fecha', authTokenAndRole(['cliente', 'admin']), obtenerTurnoController);

router.get('/listaTurnos', authTokenAndRole(['cliente', 'admin']), listaTurnosController);

router.post('/', authTokenAndRole(['cliente', 'admin']), solicitarTurnoController);

router.post('/crearTurnosSemanales', authTokenAndRole(['admin']), crearTurnosSemanalesController);

router.put('/cancelarTurno', authTokenAndRole(['cliente', 'admin']), cancelarTurnoController);

router.put('/:turnoId', authTokenAndRole(['cliente', 'admin']), modificarTurnoController);

export default router;