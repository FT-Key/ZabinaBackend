import AnimalModel from "../models/animal.schema.js";
import UserModel from "../models/usuario.schema.js";
import cloudinary from "../helpers/cloudinary.config.js";
import mongoose from 'mongoose';

export const getAnimalesService = async (pagination = null, filters = {}) => {

  if (filters && filters.duenio) {
    if (mongoose.Types.ObjectId.isValid(filters.duenio)) {

      const duenioObjectId = new mongoose.Types.ObjectId(filters.duenio);
      filters.duenio = duenioObjectId;
    } else {
      console.error("ID dueño no válido:", filters.duenio);
      return {
        animales: [],
        totalAnimales: 0,
        statusCode: 400,
        message: "ID de dueño no válido",
      };
    }
  }

  let animales;
  let totalAnimales = await AnimalModel.countDocuments(filters);

  if (pagination) {
    const { skip, limit } = pagination;
    animales = await AnimalModel.find(filters)
      .skip(skip)
      .limit(limit)
      .populate("duenio", "nombre email")
      .populate("plan", "nombre descripcion precio");
  } else {
    animales = await AnimalModel.find(filters)
      .populate("duenio", "nombre email")
      .populate("plan", "nombre descripcion precio");
  }

  return {
    animales,
    totalAnimales,
    statusCode: 200,
  };
};

export const getAnimalService = async (idAnimal) => {
  const animal = await AnimalModel.findById(idAnimal)
    .populate("duenio", "nombre email")
    .populate("plan", "nombre descripcion precio");

  if (animal) {
    return {
      animal,
      statusCode: 200,
    };
  } else {
    return {
      mensaje: "Animal no encontrado",
      statusCode: 404,
    };
  }
};

export const postAnimalService = async (nuevoAnimalData) => {
  const nuevoAnimal = new AnimalModel(nuevoAnimalData);

  try {
    await nuevoAnimal.save();
    console.log("Punto de control 4");
    return {
      mensaje: "Animal creado con éxito!",
      statusCode: 201,
      nuevoAnimal,
    };
  } catch (error) {
    console.error("Error al crear el animal:", error.message);
    return {
      mensaje: "Error al crear el animal",
      statusCode: 500,
      error: error.message,
    };
  }
};

export const putAnimalService = async (idAnimal, animalData) => {
  const animal = await AnimalModel.findById(idAnimal);

  if (!animal) {
    return {
      mensaje: "Animal no encontrado",
      statusCode: 404,
    };
  }

  Object.assign(animal, animalData);
  animal.actualizadoEn = new Date();

  const animalActualizado = await animal.save();

  return {
    mensaje: "Animal actualizado",
    animal: animalActualizado,
    statusCode: 200,
  };
};

export const deleteAnimalService = async (idAnimal, user) => {
  const animal = await AnimalModel.findById(idAnimal);

  if (!animal) {
    return {
      mensaje: "Animal no encontrado",
      statusCode: 404,
    };
  }

  if (user.rol === 'admin' || animal.duenio.toString() === user._id.toString()) {
    await AnimalModel.findByIdAndDelete(idAnimal);

    const usuarios = await UserModel.find({ mascotas: idAnimal });

    for (const usuario of usuarios) {
      usuario.mascotas = usuario.mascotas.filter(mascotaId => mascotaId.toString() !== idAnimal);
      await usuario.save();
    }

    return {
      mensaje: "Animal eliminado y referencias actualizadas",
      statusCode: 200,
    };
  }

  return {
    mensaje: "No tienes permiso para eliminar este animal",
    statusCode: 403,
  };
};

export const agregarFotoAnimalService = async (idAnimal, file) => {
  const animal = await AnimalModel.findById(idAnimal);
  if (!animal) {
    return {
      mensaje: "Animal no encontrado",
      statusCode: 404,
    };
  }

  const imagen = await cloudinary.uploader.upload(file.path);
  animal.fotoUrl = imagen.secure_url;

  await animal.save();

  return {
    mensaje: "Foto de animal cargada",
    statusCode: 200,
  };
};

export const createAnimalService = async (animalData, userId) => {
  try {
    const newAnimal = new AnimalModel(animalData);
    await newAnimal.save();

    const usuario = await UserModel.findById(userId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    usuario.mascotas.push(newAnimal._id);
    await usuario.save();

    return newAnimal;
  } catch (error) {
    throw new Error('Error al crear el animal: ' + error.message);
  }
};