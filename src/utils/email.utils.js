import { transporter } from "../helpers/nodemailer.config.js";

export const enviarCorreo = async (destinatario, asunto, mensaje) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: asunto,
    text: mensaje,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado correctamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

export const generatePasswordResetToken = (user) => {
  const payload = {
    userId: user._id, // solo lo necesario
  };

  return jwt.sign(payload, process.env.JWT_PASSWORD_SECRET, { expiresIn: "15m" });
};

export const validarTokenRecuperacion = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valido: true, datos: decoded };
  } catch (error) {
    return { valido: false, error: error.message };
  }
};