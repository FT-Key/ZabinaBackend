import {
  addProductToCartService,
  buyProductsMPService,
  getCartService,
  removeProductFromCartService,
} from "../services/carrito.service.js";

export const addProductToCartController = async (req, res) => {
  try {
    const idUsuario = req.user._id;
    const { idProducto } = req.params;
    const cart = await addProductToCartService(idUsuario, idProducto);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeProductFromCartController = async (req, res) => {
  try {
    const idUsuario = req.user._id;
    const { idProducto } = req.params;
    const cart = await removeProductFromCartService(idUsuario, idProducto);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCartController = async (req, res) => {
  try {
    const idUsuario = req.user._id;
    const cart = await getCartService(idUsuario);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const buyProductsMPController = async (req, res) => {
  try {
    const { productos, returnUrl } = req.body;

    if (!returnUrl) {
      throw new Error('Falta la URL de retorno');
    }

    const cart = await buyProductsMPService(productos, returnUrl);
    res.status(200).json(cart.url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};