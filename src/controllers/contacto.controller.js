import { postContactoService, postDonationService } from '../services/contacto.service.js';

export const postContactoController = async (req, res) => {
  const { nombre, email, telefono, asunto, mensaje } = req.body;

  try {
    await postContactoService({ nombre, email, telefono, asunto, mensaje });

    return res.status(200).json({ message: 'Correo enviado con éxito.' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return res.status(500).json({ error: 'Error al enviar el correo.' });
  }
};

export const postDonationController = async (req, res) => {
  const { amount, paymentMethod, returnUrl } = req.body;

  try {
    const donationResponse = await postDonationService(amount, paymentMethod, returnUrl);
    return res.status(donationResponse.statusCode).json(donationResponse);
  } catch (error) {
    console.error('Error al procesar la donación:', error);
    return res.status(500).json({ error: error.message });
  }
};