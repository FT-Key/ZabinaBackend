import UserModel from "../models/usuario.schema.js";
import { enviarCorreo, generatePasswordResetToken, validarTokenRecuperacion } from "../utils/email.utils.js";
import { hashPassword } from '../utils/register.utils.js';

export async function recuperarContraseniaService(email) {
  try {
    const usuarioEncontrado = await UserModel.findOne({ email: email });

    if (usuarioEncontrado && usuarioEncontrado.bloqueado) {
      await enviarCorreo({
        to: email,
        subject: "Cuenta bloqueada",
        html: `
          <p>Hola,</p>
          <p>Tu cuenta está actualmente bloqueada. Si esto es un error, por favor contacta a soporte.</p>
        `
      });
    }

    if (usuarioEncontrado && !usuarioEncontrado.bloqueado) {
      const token = generatePasswordResetToken({ id: usuarioEncontrado._id });
      const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

      await enviarCorreo({
        to: email,
        subject: "Recuperación de contraseña",
        html: `
          <p>Hola,</p>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
          <p>Este enlace expirará en 15 minutos.</p>
        `
      });
    }

    return {
      statusCode: 200,
      msg: "Si el correo está registrado, se enviará un enlace de recuperación.",
    };
  } catch (error) {
    return { statusCode: 500, msg: "Error en el servidor" };
  }
}

export async function actualizarContraseniaService(token, nuevaContrasenia) {
  const { valido, datos, error } = validarTokenRecuperacion(token);

  if (!valido) {
    return { statusCode: 401, msg: 'Token inválido o expirado', error };
  }

  const usuario = await UserModel.findById(datos.userId);
  if (!usuario) {
    return { statusCode: 404, msg: 'Usuario no encontrado' };
  }

  const hashedPassword = await hashPassword(nuevaContrasenia);
  usuario.contrasenia = hashedPassword;
  await usuario.save();

  return { statusCode: 200, msg: 'Contraseña actualizada con éxito' };
}
