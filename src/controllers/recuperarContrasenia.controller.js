import { actualizarContraseniaService } from '../services/recuperarContrasenia.service.js';

export const recuperarContraseniaController = async (req, res) => {
  try {
    const email = req.body.email;

    let result = await recuperarContraseniaService(email);

    return res
      .status(result.statusCode)
      .json({ msg: result.msg, token: result.token });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};

export async function nuevaContraseniaController(req, res) {
  const { token, nuevaContrasenia } = req.body;

  if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
    return res.status(400).json({ msg: 'Token inválido o requerido' });
  }

  if (!nuevaContrasenia || nuevaContrasenia.length < 6) {
    return res.status(400).json({ msg: 'Nueva contraseña inválida' });
  }

  try {
    const result = await actualizarContraseniaService(token, nuevaContrasenia);
    if (result.error) {
      return res.status(result.statusCode).json({ msg: result.msg });
    }
    return res.status(200).json({ msg: result.msg });
  } catch (error) {
    return res.status(500).json({ msg: 'Error interno del servidor' });
  }
}