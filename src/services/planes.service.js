import PlanModel from '../models/plan.schema.js';
import { MercadoPagoConfig, Preference } from "mercadopago";

export const getPlanesService = async (pagination = null) => {
  const totalPlanes = await PlanModel.countDocuments();
  let planes;
  
  if (pagination) {
    const { skip, limit } = pagination;
    planes = await PlanModel.find().skip(skip).limit(limit);
  } else {
    planes = await PlanModel.find();
  }

  return {
    planes,
    totalPlanes,
    statusCode: 200,
  };
};

export const getPlanService = async (idPlan) => {
  const plan = await PlanModel.findById(idPlan);
  if (plan) {
    return { plan, statusCode: 200 };
  } else {
    return { msg: "Plan no encontrado", statusCode: 404 };
  }
};

export const postPlanService = async (nuevoPlanData) => {
  const nuevoPlan = new PlanModel(nuevoPlanData);
  await nuevoPlan.save();

  return {
    msg: "Plan creado con éxito!",
    nuevoPlan,
    statusCode: 201,
  };
};

export const putPlanService = async (idPlan, planData) => {
  const planActualizado = await PlanModel.findByIdAndUpdate(idPlan, planData, { new: true });
  
  if (planActualizado) {
    return {
      msg: "Plan actualizado con éxito!",
      plan: planActualizado,
      statusCode: 200,
    };
  } else {
    return { msg: "Plan no encontrado", statusCode: 404 };
  }
};

export const deletePlanService = async (idPlan) => {
  const planEliminado = await PlanModel.findByIdAndDelete(idPlan);
  
  if (planEliminado) {
    return { msg: "Plan eliminado con éxito!", statusCode: 200 };
  } else {
    return { msg: "Plan no encontrado", statusCode: 404 };
  }
};

export const comprarPlanService = async (planSeleccionado, mascotaSeleccionada, returnUrl) => {
  const cliente = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
  });

  const plan = await PlanModel.findById(planSeleccionado.idPlan);

  if (!plan) {
    throw new Error(`Plan con id ${planSeleccionado.idPlan} no encontrado`);
  }

  const items = [
    {
      title: `Plan ${plan.nombre} para ${mascotaSeleccionada.nombre}`,
      quantity: 1,
      unit_price: plan.precio,
      currency_id: 'ARS',
    }
  ];

  const preference = new Preference(cliente);

  const result = await preference.create({
    body: {
      items,
      back_urls: {
        success: `${returnUrl}/success`,
        failure: `${returnUrl}/failure`,
        pending: `${returnUrl}/pending`,
      },
      auto_return: 'approved',
    }
  });

  return {
    url: result.id,
    statusCode: 200,
  };
};