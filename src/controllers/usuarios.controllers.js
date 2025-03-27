import {
  getUsuariosService,
  getUsuarioService,
  postUsuarioService,
  putUsuarioService,
  deleteUsuarioService,
  agregarFotoPerfilService
} from '../services/usuarios.service.js';

export const getUsuarios = async (req, res) => {
  try {
    const filters = req.filters || {};
    const result = await getUsuariosService(req.pagination, filters);

    return res.status(result.statusCode).json({
      usuarios: result.usuarios,
      totalUsuarios: result.totalUsuarios,
      page: req.pagination ? req.pagination.page : null,
      limit: req.pagination ? req.pagination.limit : null
    });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};

export const getUsuario = async (req, res) => {
  try {
    const idUsuario = req.params.idUsuario;
    const result = await getUsuarioService(idUsuario);
    return res.status(result.statusCode).json(result.usuario || { msg: result.mensaje });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};

export const postUsuario = async (req, res) => {
  try {
    const nuevoUsuarioData = req.body;
    const result = await postUsuarioService(nuevoUsuarioData);
    return res.status(result.statusCode).json({ msg: result.mensaje, nuevoUsuario: result.nuevoUsuario });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};

export const putUsuario = async (req, res) => {
  try {
    const idUsuario = req.params.idUsuario;
    const usuarioData = req.body;
    const result = await putUsuarioService(idUsuario, usuarioData);
    return res.status(result.statusCode).json({ msg: result.mensaje, usuario: result.usuario });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const idUsuario = req.params.idUsuario;
    const result = await deleteUsuarioService(idUsuario);
    return res.status(result.statusCode).json({ msg: result.mensaje });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};



export const agregarFotoPerfilController = async (req, res) => {
  const result = await agregarFotoPerfilService(req.params.idUsuario, req.file);

  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg, usuario: result.usuario });
  } else {
    res.status(500).json({ msg: 'Error al cargar foto de perfil' });
  }
};