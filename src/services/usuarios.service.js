import UserModel from "../models/usuario.schema.js";
import CartModel from "../models/carrito.schema.js";
import FavModel from "../models/favoritos.schema.js";
import cloudinary from "../helpers/cloudinary.config.js";

export const getUsuariosService = async (pagination = null, filters = {}) => {
  // Total de usuarios que cumplen los filtros
  const totalUsuarios = await UserModel.countDocuments(filters);

  // Construimos la consulta base
  let query = UserModel.find(filters);

  // Si hay paginación, la aplicamos
  if (pagination) {
    const { skip, limit } = pagination;
    query = query.skip(skip).limit(limit);
  }

  // Ejecutamos la consulta; ya no hay populate()
  const usuarios = await query.exec();

  // Devolvemos la respuesta estándar
  return {
    usuarios,
    totalUsuarios,
    statusCode: 200,
  };
};


export const getUsuarioService = async (idUsuario) => {
  try {
    const usuario = await UserModel.findOne({ _id: idUsuario });

    if (usuario) {
      return {
        usuario,
        statusCode: 200,
      };
    } else {
      return {
        mensaje: 'Usuario no encontrado',
        statusCode: 404,
      };
    }
  } catch (error) {
    return {
      mensaje: 'Error al obtener el usuario',
      statusCode: 500,
      error: error.message,
    };
  }
};

export const postUsuarioService = async (nuevoUsuarioData) => {
  nuevoUsuarioData.creadoEn = Date.now();
  nuevoUsuarioData.actualizadoEn = Date.now();

  const nuevoUsuario = new UserModel(nuevoUsuarioData);

  const carrito = new CartModel({ idUsuario: nuevoUsuario._id });
  const favoritos = new FavModel({ idUsuario: nuevoUsuario._id });
  await carrito.save();
  await favoritos.save();

  nuevoUsuario.idCarrito = carrito._id;
  nuevoUsuario.idFavoritos = favoritos._id;

  await nuevoUsuario.save();

  return {
    mensaje: "Usuario creado con éxito!",
    statusCode: 201,
    nuevoUsuario,
  };
};

export const putUsuarioService = async (idUsuario, usuarioData) => {
  console.log("Entra aqui 5 - 1");

  // Si tiene fotoPerfil nueva, asegurate de mantener el array actualizado
  const usuario = await UserModel.findById(idUsuario);

  if (!usuario) {
    return {
      mensaje: "Usuario no encontrado",
      statusCode: 404,
    };
  }

  if (usuarioData.fotoPerfil) {
    if (!usuario.fotosPerfil.includes(usuarioData.fotoPerfil)) {
      usuarioData.fotosPerfil = [...usuario.fotosPerfil, usuarioData.fotoPerfil];
    }
  }

  console.log("Entra aqui 5 - 6", usuarioData);

  const usuarioActualizado = await UserModel.findByIdAndUpdate(
    idUsuario,
    { $set: usuarioData },
    { new: true, runValidators: true }
  );

  console.log("Entra aqui 5 - 7");

  return {
    mensaje: "Usuario actualizado",
    usuario: usuarioActualizado,
    statusCode: 200,
  };
};

export const deleteUsuarioService = async (idUsuario) => {
  await UserModel.findByIdAndDelete({ _id: idUsuario });

  return {
    mensaje: "Usuario eliminado",
    statusCode: 200,
  };
};

export const agregarFotoPerfilService = async (idUsuario, file) => {
  const usuario = await UserModel.findById(idUsuario);
  const imagen = await cloudinary.uploader.upload(file.path);
  usuario.fotoPerfil = imagen.secure_url;
  if (!usuario.fotosPerfil.includes(imagen.secure_url)) {
    usuario.fotosPerfil.push(imagen.secure_url);
  }

  await usuario.save();

  return {
    msg: 'Foto de perfil cargada',
    statusCode: 200,
    usuario
  }
};