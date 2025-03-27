import cloudinary from "../helpers/cloudinary.config.js";
import ProductModel from "../models/producto.schema.js";

export const getProductosService = async (pagination = null, filters = {}) => {
  let productos;
  let totalProductos = await ProductModel.countDocuments(filters);

  if (pagination) {
    const { skip, limit } = pagination;
    productos = await ProductModel.find(filters)
      .skip(skip)
      .limit(limit);
  } else {
    productos = await ProductModel.find(filters);
  }

  return {
    productos,
    totalProductos,
    statusCode: 200,
  };
};

export const getProductoService = async (idProducto) => {
  const producto = await ProductModel.findOne({ _id: idProducto });

  if (producto) {
    return {
      producto,
      statusCode: 200,
    };
  } else {
    return {
      mensaje: "Producto no encontrado",
      statusCode: 404,
    };
  }
};

export const postProductoService = async (nuevoProductoData) => {
  const nuevoProducto = await ProductModel(nuevoProductoData);

  try {
    await nuevoProducto.save();
    console.log("Punto de control 4");
    return {
      mensaje: "Producto creado con éxito!",
      statusCode: 201,
      nuevoProducto,
    };
  } catch (error) {
    console.error("Error al crear el producto:", error.message);
    return {
      mensaje: "Error al crear el producto",
      statusCode: 500,
      error: error.message,
    };
  }
};

export const putProductoService = async (idProducto, productoData) => {

  const productoActualizado = await ProductModel.findOneAndUpdate(
    { _id: idProducto },
    productoData,
    { new: true }
  );

  return {
    mensaje: "Producto actualizado",
    producto: productoActualizado,
    statusCode: 200,
  };
};

export const deleteProductoService = async (idProducto) => {

  await ProductModel.findByIdAndDelete({ _id: idProducto });

  return {
    mensaje: "Producto eliminado",
    statusCode: 200,
  };
};

export const agregarImagenProductoService = async (idProducto, file) => {
  const producto = await ProductModel.findById(idProducto);
  const imagen = await cloudinary.uploader.upload(file.path);
  producto.imagenUrl = imagen.secure_url;
  if (!producto.imagenesUrls.includes(imagen.secure_url)) {
    producto.imagenesUrls.push(imagen.secure_url);
  }

  await producto.save();

  return {
    msg: 'Imagen cargada',
    statusCode: 200,
    producto
  }
};