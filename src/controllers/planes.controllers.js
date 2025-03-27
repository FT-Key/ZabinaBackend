import { 
  getPlanesService, 
  getPlanService, 
  postPlanService, 
  putPlanService, 
  deletePlanService,
  comprarPlanService 
} from '../services/planes.service.js';

export const getPlanesController = async (req, res) => {
  try {
    const result = await getPlanesService(req.pagination);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ msg: "Error al obtener los planes." });
  }
};

export const getPlanController = async (req, res) => {
  try {
    const idPlan = req.params.idPlan;
    const result = await getPlanService(idPlan);
    if (result.statusCode === 200) {
      return res.status(200).json(result.plan);
    } else {
      return res.status(404).json({ msg: result.msg });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};

export const postPlanController = async (req, res) => {
  try {
    const nuevoPlanData = req.body;
    const result = await postPlanService(nuevoPlanData);
    return res.status(result.statusCode).json({ msg: result.msg, plan: result.nuevoPlan });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};

export const putPlanController = async (req, res) => {
  try {
    const idPlan = req.params.idPlan;
    const planData = req.body;
    const result = await putPlanService(idPlan, planData);
    return res.status(result.statusCode).json({ msg: result.msg, plan: result.plan });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};

export const deletePlanController = async (req, res) => {
  try {
    const idPlan = req.params.idPlan;
    const result = await deletePlanService(idPlan);
    return res.status(result.statusCode).json({ msg: result.msg });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};

export const comprarPlanController = async (req, res) => {
  try {
    const { planSeleccionado, mascotaSeleccionada, returnUrl } = req.body;

    const response = await comprarPlanService(planSeleccionado, mascotaSeleccionada, returnUrl);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};