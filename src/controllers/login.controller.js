import { closeLoginService, googleLoginService, loginService } from "../services/login.service.js";

export const loginController = async (req, res) => {
  try {
    const usuarioData = req.body;

    const transformedData = {
      nombreDeUsuario: usuarioData.userName,
      contraseniaDeUsuario: usuarioData.userPass,
      recordarme: usuarioData.userRemember,
    };

    let result;

    if (usuarioData.userPass) {
      result = await loginService(transformedData);
    } else {
      const token = usuarioData.token;
      result = await googleLoginService(token);
    }

    return res
      .status(result.statusCode)
      .json({ msg: result.msg, token: result.token });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};

export const closeLoginController = async (req, res) => {
  try {
    const usuarioData = req.user;
    closeLoginService(usuarioData);

    return res
      .status(result.statusCode)
      .json({ msg: result.mensaje, token: result.token });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};