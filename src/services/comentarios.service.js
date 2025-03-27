import ComentarioModel from '../models/comentarios.schema.js';

export const getComentariosService = async (pagination = null, filters = {}) => {
  let comentarios;
  let totalComentarios = await ComentarioModel.countDocuments(filters);

  if (pagination) {
    const { skip, limit } = pagination;
    comentarios = await ComentarioModel.find(filters)
      .skip(skip)
      .limit(limit);
  } else {
    comentarios = await ComentarioModel.find(filters);
  }

  return {
    comentarios,
    totalComentarios,
    statusCode: 200,
  };
};

export const postComentarioService = async (nuevoComentarioData) => {
  const nuevoComentario = new ComentarioModel(nuevoComentarioData);

  try {
    await nuevoComentario.save();
    return {
      mensaje: "Comentario creado con éxito!",
      statusCode: 201,
      nuevoComentario,
    };
  } catch (error) {
    console.error("Error al crear el comentario:", error.message);
    return {
      mensaje: "Error al crear el comentario",
      statusCode: 500,
      error: error.message,
    };
  }
};

export const deleteComentarioService = async (idComentario, user) => {
  const comentario = await ComentarioModel.findById(idComentario);
  
  if (!comentario) {
    return {
      mensaje: "Comentario no encontrado",
      statusCode: 404,
    };
  }
  
  if (user.rol === 'admin') {
    await ComentarioModel.findByIdAndDelete(idComentario);
    return {
      mensaje: "Comentario eliminado",
      statusCode: 200,
    };
  }
  
  return {
    mensaje: "No tienes permiso para eliminar este comentario",
    statusCode: 403,
  };
};