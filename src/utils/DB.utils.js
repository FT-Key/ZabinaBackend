import { postProductoService } from "../services/productos.service.js";
import { postUsuarioService } from "../services/usuarios.service.js";
import { postComentarioService } from "../services/comentarios.service.js";
import UserModel from "../models/usuario.schema.js";
import ProductModel from "../models/producto.schema.js";
import ComentarioModel from "../models/comentarios.schema.js";
import { usuarios } from "../mocks/usuarios.mock.js";
import { ropaData } from "../mocks/productos.mock.js";
import { comentarios } from "../mocks/comentarios.mock.js";
import { hashPassword } from "./register.utils.js";

export function poblarDB() {

  const inicializarProductos = async () => {
    try {
      const productosExistentes = await ProductModel.find();

      if (productosExistentes.length === 0) {
        for (const producto of ropaData) {
          const resultado = await postProductoService(producto);
          console.log(resultado.mensaje);
        }
        console.log("Productos iniciales creados con éxito.");
      } else {
        console.log("La base de datos ya contiene productos.");
      }
    } catch (error) {
      console.error("Error al inicializar productos:", error);
    }
  };

  const inicializarUsuarios = async () => {
    try {
      const usuariosExistentes = await UserModel.find();

      if (usuariosExistentes.length === 0) {
        for (const usuario of usuarios) {
          const hashedPassword = await hashPassword(usuario.contrasenia);

          const usuarioContraseniaHasheada = {
            ...usuario,
            contrasenia: hashedPassword
          };

          const resultado = await postUsuarioService(usuarioContraseniaHasheada);
          console.log(resultado.mensaje);
        }
        console.log("Usuarios iniciales creados con éxito.");
      } else {
        console.log("La base de datos ya contiene usuarios.");
      }
    } catch (error) {
      console.error("Error al inicializar usuarios:", error);
    }
  };

  const inicializarComentarios = async () => {
    try {
      const comentariosExistentes = await ComentarioModel.find();

      if (comentariosExistentes.length === 0) {
        for (const comentario of comentarios) {
          const resultado = await postComentarioService(comentario);
          console.log(resultado.mensaje);
        }
        console.log("Comentarios iniciales creados con éxito.");
      } else {
        console.log("La base de datos ya contiene comentarios.");
      }
    } catch (error) {
      console.error("Error al inicializar comentarios:", error);
    }
  };

  inicializarUsuarios();
  inicializarProductos();
  inicializarComentarios();
}