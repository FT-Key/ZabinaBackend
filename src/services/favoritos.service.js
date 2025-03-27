import FavModel from "../models/favoritos.schema.js";

export const addProductToFavService = async (idUsuario, idProducto) => {
  let fav = await FavModel.findOne({ idUsuario });

  if (!fav) {
    fav = new FavModel({ idUsuario, productos: [idProducto] });
  } else {
    const productoExiste = fav.productos.some(prod => prod.toString() === idProducto.toString());

    if (!productoExiste) {
      fav.productos.push(idProducto);
    }
  }

  await fav.save();
  return fav.populate("productos");
};

export const removeProductFromFavService = async (idUsuario, idProducto) => {
  const fav = await FavModel.findOne({ idUsuario });

  if (!fav) throw new Error("Lista de favoritos no encontrada");

  fav.productos = fav.productos.filter(
    (product) => product.toString() !== idProducto
  );

  await fav.save();
  return fav.populate("productos");
};

export const getFavService = async (idUsuario) => {
  const fav = await FavModel.findOne({ idUsuario }).populate("productos");

  if (!fav) throw new Error("Lista de favoritos no encontrada");

  return fav;
};
