import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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