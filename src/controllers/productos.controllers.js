import {
  getProductosService,
  getProductoService,
  postProductoService,
  putProductoService,
  deleteProductoService,
  agregarImagenProductoService
} from '../services/productos.service.js';

export const getProductosController = async (req, res) => {
  try {
    const filters = req.filters || {};
    const result = await getProductosService(req.pagination, filters);

    if (result.statusCode === 200) {
      return res.status(200).json({
        productos: result.productos,
        totalProductos: result.totalProductos,
        page: req.pagination ? req.pagination.page : null,
        limit: req.pagination ? req.pagination.limit : null
      });
    } else {
      return res.status(500).json({ msg: "Error al traer los productos." });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};

export const getProductoController = async (req, res) => {
  try {
    const idProducto = req.params.idProducto;
    const result = await getProductoService(idProducto);
    if (result.statusCode === 200) {
      return res.status(200).json(result.producto);
    } else {
      return res.status(404).json({ msg: result.mensaje });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};

export const postProductoController = async (req, res) => {
  try {
    const nuevoProductoData = req.body;
    const result = await postProductoService(nuevoProductoData);
    return res.status(result.statusCode).json({ msg: result.mensaje, nuevoProducto: result.nuevoProducto });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};

export const putProductoController = async (req, res) => {
  try {
    const idProducto = req.params.idProducto;
    const productoData = req.body;
    const result = await putProductoService(idProducto, productoData);
    return res.status(result.statusCode).json({ msg: result.mensaje, producto: result.producto });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};

export const deleteProductoController = async (req, res) => {
  try {
    const idProducto = req.params.idProducto;
    const result = await deleteProductoService(idProducto);
    return res.status(result.statusCode).json({ msg: result.mensaje });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno del servidor." });
  }
};

export const agregarImagenProductoController = async (req, res) => {
  const result = await agregarImagenProductoService(req.params.idProducto, req.file);

  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg, producto: result.producto });
  } else {
    res.status(500).json({ msg: 'Error al cargar la imagen del producto' });
  }
};