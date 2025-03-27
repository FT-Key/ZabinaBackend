import { enviarCorreo } from '../utils/mailer.js';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export const postContactoService = async ({ nombre, email, telefono, asunto, mensaje }) => {
  const contenidoMensaje = `
    Nombre: ${nombre}
    Email: ${email}
    Teléfono: ${telefono ? telefono : 'No proporcionado'}
    Mensaje: ${mensaje}
  `;

  const correoDestino = 'CuentaAmigoNumero1@gmail.com';

  await enviarCorreo(correoDestino, asunto, contenidoMensaje);
};

export const postDonationService = async (amount, paymentMethod, returnUrl) => {
  if (paymentMethod === 'mercadoPago') {
    return await MPDonationHandler(amount, returnUrl);
  } else {
    throw new Error(`Método de pago ${paymentMethod} no soportado`);
  }
};

const MPDonationHandler = async (amount, returnUrl) => {
  const cliente = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
  });

  const items = [
    {
      title: 'Donación a fundación RollingVet',
      quantity: 1,
      unit_price: amount,
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