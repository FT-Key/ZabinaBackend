import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const ESTADOS_ANIMAL = ["Mascota", "En Adopción"];
const ESPECIES = ["Perro", "Gato", "Ave", "Conejo", "Reptil", "Otro"];
const VACUNAS = [
  "Rabia",
  "Parvovirus",
  "Distemper",
  "Hepatitis",
  "Leptospirosis",
  "Bordetella",
];
const GENEROS = [
  "Macho",
  "Hembra",
];

const VacunasSchema = new Schema({
  nombre: { type: String, required: true, enum: VACUNAS },
  fecha: { type: Date, required: true },
});

const AnimalSchema = new Schema({
  duenio: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  tipo: { type: String, enum: ESPECIES, required: true },
  raza: { type: String },
  nombre: { type: String, required: true },
  edad: { type: Number, required: true },
  genero: { type: String, required: true, enum: GENEROS },
  descripcion: { type: String },
  vacunas: { type: [VacunasSchema], default: [] },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", default: null },
  estado: { type: String, enum: ESTADOS_ANIMAL, required: true },
  fotoUrl: { type: String, default: "https://via.placeholder.com/150" },
  ultimaVisitaVeterinaria: { type: Date },
  esterilizado: { type: Boolean, default: false },
  peso: { type: Number },
  historialMedico: { type: [String], default: [] },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", default: null },
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date },
});

const Animal = model("Animal", AnimalSchema);

export default Animal;