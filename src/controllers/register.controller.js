import {
  googleRegisterService,
  registerService,
} from "../services/register.service.js";

export const postRegister = async (req, res) => {
  try {
    const usuarioData = req.body;
    
    let result;
    
    if (usuarioData.userPass) {
      result = await registerService(usuarioData);
    } else {
      const token = usuarioData.token;
      result = await googleRegisterService(token);
    }
    
    return res
      .status(result.statusCode)
      .json({ msg: result.mensaje, nuevoUsuario: result.nuevoUsuario, token: result.token });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};
