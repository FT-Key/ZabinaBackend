import { getUsuariosService, postUsuarioService } from "./usuarios.service.js";
import { hashPassword } from "../utils/register.utils.js";
import { generateJwtToken } from "../utils/login.utils.js";
import UserModel from "../models/usuario.schema.js";

export async function registerService(userData) {
  try {
    const respuesta = await getUsuariosService();
    const usuarios = respuesta.usuarios;

    const {
      userName: nombreDeUsuario,
      userEmail: emailDeUsuario,
      userPass: contraseniaDeUsuario,
      userPassConf: confContraseniaDeUsuario,
    } = userData;

    if (confContraseniaDeUsuario !== contraseniaDeUsuario) {
      return {
        mensaje: "Las contraseñas no coinciden",
        statusCode: 400,
      };
    }

    const nombreUsuarioEncontrado = await UserModel.findOne({
      nombreUsuario: nombreDeUsuario,
    });

    if (nombreUsuarioEncontrado) {
      return {
        mensaje: "Ya existe un usuario registrado con ese nombre de usuario",
        statusCode: 400,
      };
    }

    const emailUsuarioEncontrado = await UserModel.findOne({
      email: emailDeUsuario,
    });

    if (emailUsuarioEncontrado) {
      return {
        mensaje: "Ya existe un usuario registrado con ese email",
        statusCode: 400,
      };
    }

    const contraseniaHasheada = await hashPassword(contraseniaDeUsuario);
    const nuevaId = usuarios[usuarios.length - 1]?.id + 1 || 1;
    const nuevoRol = emailDeUsuario === "fr4nc0t2@gmail.com" ? "admin" : "cliente";

    const nuevoUsuarioData = {
      id: nuevaId,
      nombreUsuario: nombreDeUsuario,
      email: emailDeUsuario,
      contrasenia: contraseniaHasheada,
      rol: nuevoRol,
      actualizadoEn: Date.now,
      creadoEn: Date.now,
    };

    const response = await postUsuarioService(nuevoUsuarioData);

    const jwtToken = generateJwtToken(response.nuevoUsuario);

    return {
      statusCode: response.statusCode,
      token: jwtToken,
      mensaje: response.mensaje,
      nuevoUsuario: response.nuevoUsuario,
    };
  } catch (error) {
    console.error("Error en el registro de usuario:", error);
    return {
      mensaje: "Error en el servidor al crear usuario",
      statusCode: 500,
    };
  }
}

export async function googleRegisterService(token) {
  try {
    const respuesta = await getUsuariosService();
    const usuarios = respuesta.usuarios;

    // Verificar el token con Google
    const responseGoogle = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userInfo = await responseGoogle.json();

    if (userInfo.error) {
      return { statusCode: 400, mensaje: "Token inválido" };
    }

    const usuarioExistente = await UserModel.findOne({ email: userInfo.email });

    if (usuarioExistente) {
      return { statusCode: 404, mensaje: "Usuario ya existente" };
    }

    const nuevaId = usuarios[usuarios.length - 1].id + 1 || 1;
    let nuevoNombreUsuario;
    let index = nuevaId - 1;
    let existeUsuario;

    while (true) {
      index++;
      nuevoNombreUsuario = `Usuario${index}`;
      existeUsuario = usuarios.some(
        (u) => u.nombreUsuario === nuevoNombreUsuario
      );

      if (!existeUsuario) {
        break;
      }
    }

    // Hashear la contraseña (userInfo.sub en este caso de inicio con Google)
    const userSubString = String(userInfo.sub).trim();
    const contraseniaHasheada = await hashPassword(userSubString);

    const nuevoRol = userInfo.email === 'fr4nc0t2@gmail.com' ? 'admin' : 'cliente';

    const nuevoUsuarioData = {
      id: nuevaId,
      nombreUsuario: nuevoNombreUsuario,
      email: userInfo.email,
      contrasenia: contraseniaHasheada,
      tipoRegistro: "google",
      verificacionEmail: userInfo.email_verified,
      nombre: userInfo.given_name,
      apellido: userInfo.family_name,
      fotoPerfil: userInfo.picture,
      rol: nuevoRol,
      actualizadoEn: Date.now(),
      creadoEn: Date.now(),
    };

    const response = await postUsuarioService(nuevoUsuarioData);

    const jwtToken = generateJwtToken(response.nuevoUsuario);

    return {
      statusCode: response.statusCode,
      token: jwtToken,
      mensaje: response.mensaje,
      nuevoUsuario: response.nuevoUsuario,
    };
  } catch (error) {
    console.error("Error en googleRegisterService", error);
    return { statusCode: 500, mensaje: "Error al verificar el token" };
  }
}
