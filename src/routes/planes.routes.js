import { Router } from 'express';
import {
  getPlanesController,
  getPlanController,
  postPlanController,
  putPlanController,
  deletePlanController,
  comprarPlanController
} from '../controllers/planes.controllers.js';
import { authTokenAndRole } from '../middlewares/auth.js';
import { paginationMiddleware } from '../utils/pagination.js';
import PlanModel from '../models/plan.schema.js';
const router = Router();

/* GET */
router.get('/', paginationMiddleware, getPlanesController);

/* GET con parámetro */
router.get('/:idPlan', getPlanController);

/* POST */
router.post('/', authTokenAndRole('admin'), postPlanController);

/* PUT */
router.put('/comprarPlan', authTokenAndRole(['cliente', 'admin']), comprarPlanController);
router.put('/:idPlan', authTokenAndRole('admin'), putPlanController);

/* DELETE */
router.delete('/:idPlan', authTokenAndRole('admin'), deletePlanController);

export default router;