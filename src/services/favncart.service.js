import CartModel from "../models/carrito.schema.js";
import FavModel from "../models/favoritos.schema.js";
import ProductModel from "../models/producto.schema.js";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Carrito

export const addProductToCartService = async (idUsuario, idProducto) => {
  let cart = await CartModel.findOne({ idUsuario });

  if (!cart) {
    cart = new CartModel({ idUsuario, productos: [idProducto] });
  } else {
    const productoExiste = cart.productos.some(prod => prod.toString() === idProducto.toString());

    if (!productoExiste) {
      cart.productos.push(idProducto);
    }
  }

  await cart.save();
  return cart.populate("productos");
};

export const removeProductFromCartService = async (idUsuario, idProducto) => {
  const cart = await CartModel.findOne({ idUsuario });

  if (!cart) throw new Error("Carrito no encontrado");

  cart.productos = cart.productos.filter(
    (product) => product.toString() !== idProducto
  );

  await cart.save();
  return cart.populate("productos");
};

export const getCartService = async (idUsuario) => {
  const cart = await CartModel.findOne({ idUsuario }).populate("productos");

  if (!cart) throw new Error("Carrito no encontrado");

  return cart;
};

export const buyProductsMPService = async (productos, returnUrl) => {
  const cliente = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
  });

  const items = await Promise.all(
    productos.map(async (prod) => {
      const producto = await ProductModel.findById(prod.idProducto);

      if (!producto) {
        throw new Error(`Producto con id ${prod.idProducto} no encontrado`);
      }

      return {
        title: `${producto.nombre}`,
        quantity: prod.cantidad,
        unit_price: producto.precio,
        currency_id: 'ARS',
      };
    })
  );

  const preference = new Preference(cliente);

  const result = await preference.create({
    body: {
      items,
      back_urls: {
        success: `${returnUrl}/success`,
        failure: `${returnUrl}/failure`,
        pending: `${returnUrl}/pending`,
      },
      auto_return: 'approved',
    }
  });

  return {
    url: result.id,
    statusCode: 200,
  };
};

// Favoritos

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
