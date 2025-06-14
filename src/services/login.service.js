import fetch from "node-fetch";
import { getUsuariosService, putUsuarioService } from "./usuarios.service.js";
import { generateJwtToken, verifyPassword } from "../utils/login.utils.js";
import UserModel from "../models/usuario.schema.js";

export async function loginService(userData) {
  console.log("Entra aqui 3")

  const { nombreDeUsuario, contraseniaDeUsuario, recordarme } = userData;

  try {
    const usuarioEncontrado = await UserModel.findOne({ nombreUsuario: nombreDeUsuario }).select('+contrasenia');

    if (!usuarioEncontrado) {
      return { statusCode: 404, msg: "Usuario no encontrado" };
    }

    if (usuarioEncontrado.bloqueado) {
      return { statusCode: 403, msg: "El usuario está bloqueado" };
    }
    console.log("Entra aqui 4")
    
    if (usuarioEncontrado.tipoRegistro !== "normal") {
      return { statusCode: 400, msg: "Error al iniciar sesión, tipo de registro inválido" };
    }
    console.log("Entra aqui 4.1")
    
    const contraseniaCoincide = await verifyPassword(contraseniaDeUsuario, usuarioEncontrado.contrasenia);
    
    console.log("Entra aqui 4.2")
    if (!contraseniaCoincide) {
      return { statusCode: 400, msg: "Contraseña incorrecta" };
    }
    console.log("Entra aqui 4.3")

    const usuarioData = {
      estaActivo: true,
      ultimoIngreso: new Date(),
    };
    console.log("Entra aqui 5", usuarioEncontrado._id, usuarioData)

    const actualizacion = await putUsuarioService(usuarioEncontrado._id, usuarioData);
    console.log("Entra aqui 5.5")

    if (!actualizacion.usuario) {
      return { statusCode: 500, msg: "Error al actualizar el usuario" };
    }
    console.log("Entra aqui 6")

    const token = generateJwtToken(usuarioEncontrado);
    console.log("Entra aqui 7")

    return {
      statusCode: 200,
      token,
      msg: "Inicio de sesión exitoso!",
    };
  } catch (error) {
    return { statusCode: 500, msg: "Error en el servidor" };
  }
}

export async function googleLoginService(token) {
  try {
    // Verificar el token con Google
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userInfo = await response.json();

    if (userInfo.error) {
      return { statusCode: 400, msg: "Token inválido" };
    }

    const usuarioEncontrado = await UserModel.findOne({ email: userInfo.email })
      .select('+contrasenia')

    if (!usuarioEncontrado) {
      return { statusCode: 404, msg: "UsuarioEncontrado no encontrado" };
    }

    if (usuarioEncontrado.bloqueado) {
      return { statusCode: 403, msg: "El usuario está bloqueado" };
    }

    if (usuarioEncontrado.tipoRegistro !== "google") {
      return { statusCode: 400, msg: "Error al iniciar sesión, tipo de registro inválido" };
    }

    const userSubString = String(userInfo.sub).trim();
    const userFoundString = String(usuarioEncontrado.contrasenia).trim();
    const contraseñaCoincide = await verifyPassword(
      userSubString,
      userFoundString
    );

    if (!contraseñaCoincide) {
      return { statusCode: 401, msg: "Contraseña incorrecta" };
    }

    const usuarioData = {
      estaActivo: true,
      ultimoIngreso: new Date(),
    };

    const actualizacion = await putUsuarioService(
      usuarioEncontrado._id,
      usuarioData
    );

    if (!actualizacion.usuario) {
      return { statusCode: 500, msg: "Error al actualizar el usuario" };
    }

    const jwtToken = generateJwtToken(usuarioEncontrado);

    return {
      statusCode: 200,
      token: jwtToken,
      msg: "Inicio de sesión exitoso!",
    };
  } catch (error) {
    console.error("Error en googleLoginService", error);
    return { statusCode: 500, msg: "Error al verificar el token" };
  }
}

export async function closeLoginService(user) {
  try {
    const usuarioActualizado = await UserModel.findByIdAndUpdate(
      user._id,
      { login: false },
      { new: true }
    );

    if (!usuarioActualizado) {
      return {
        msg: "Usuario no encontrado",
        statusCode: 404,
      };
    }

    return {
      msg: "Se cerró la sesión",
      usuario: usuarioActualizado,
      statusCode: 200,
    };
  } catch (error) {
    return {
      msg: "Error al cerrar la sesión",
      error: error.msg,
      statusCode: 500,
    };
  }
}