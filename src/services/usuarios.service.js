import UserModel from "../models/usuario.schema.js";
import CartModel from "../models/carrito.schema.js";
import FavModel from "../models/favoritos.schema.js";
import AnimalModel from "../models/animal.schema.js";
import cloudinary from "../helpers/cloudinary.config.js";

export const getUsuariosService = async (pagination = null, filters = {}) => {
  let usuarios;
  let totalUsuarios = await UserModel.countDocuments(filters);

  if (pagination) {
    const { skip, limit } = pagination;
    usuarios = await UserModel.find(filters)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'mascotas',
        model: 'Animal',
      });
  } else {
    usuarios = await UserModel.find(filters)
      .populate({
        path: 'mascotas',
        model: 'Animal',
      });
  }

  return {
    usuarios,
    totalUsuarios,
    statusCode: 200,
  };
};

export const getUsuarioService = async (idUsuario) => {
  try {
    const usuario = await UserModel.findOne({ _id: idUsuario })
      .populate({
        path: 'mascotas',
        model: 'Animal',
      });

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

  const usuario = await UserModel.findById(idUsuario).populate('mascotas');

  if (usuarioData.fotoPerfil) {
    if (!usuario.fotosPerfil.includes(usuarioData.fotoPerfil)) {
      usuario.fotosPerfil.push(usuarioData.fotoPerfil);
    }
  }

  if (usuarioData.mascotas !== undefined && usuarioData.mascotas !== null) {

    const mascotasDB = usuario.mascotas.map(m => m._id.toString());

    const mascotasActualizadas = usuarioData.mascotas;

    const mascotasEliminadas = mascotasDB.filter(idMascota => !mascotasActualizadas.some(m => m._id && m._id.toString() === idMascota));

    if (mascotasEliminadas.length > 0) {
      for (const idMascota of mascotasEliminadas) {
        usuario.mascotas = usuario.mascotas.filter(mascota => mascota._id.toString() !== idMascota);
        await AnimalModel.findByIdAndDelete(idMascota);
      }
    }

    for (let mascotaFrontend of mascotasActualizadas) {
      if (!mascotaFrontend._id) {
        const nuevaMascota = new AnimalModel({
          duenio: usuario._id,
          tipo: mascotaFrontend.tipo,
          raza: mascotaFrontend.raza,
          nombre: mascotaFrontend.nombre,
          edad: mascotaFrontend.edad,
          estado: "Mascota",
          fotoUrl: "https://via.placeholder.com/150"
        });
        const mascotaGuardada = await nuevaMascota.save();
        usuario.mascotas.push(mascotaGuardada._id.toString());
      }
    }
  }

  const { mascotas, ...restoDeUsuarioData } = usuarioData;
  Object.assign(usuario, restoDeUsuarioData);

  const usuarioActualizado = await usuario.save();

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