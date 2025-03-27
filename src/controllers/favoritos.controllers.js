import {
  addProductToFavService,
  getFavService,
  removeProductFromFavService,
} from "../services/favoritos.service.js";

export const addProductToFavController = async (req, res) => {
  try {
    const idUsuario = req.user._id;
    const { idProducto } = req.params;
    const fav = await addProductToFavService(idUsuario, idProducto);
    res.status(200).json(fav);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeProductFromFavController = async (req, res) => {
  try {
    const idUsuario = req.user._id;
    const { idProducto } = req.params;
    const fav = await removeProductFromFavService(idUsuario, idProducto);
    res.status(200).json(fav);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFavController = async (req, res) => {
  try {
    const idUsuario = req.user._id;
    const fav = await getFavService(idUsuario);
    res.status(200).json(fav);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
