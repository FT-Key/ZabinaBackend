import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const IDIOMAS = ["Español", "Inglés", "Francés", "Alemán", "Italiano"];
const TEMAS = ["Claro", "Oscuro"];
const PREGUNTAS_SEGURIDAD = [
  "¿Cuál es el nombre de tu mascota?",
  "¿Cuál es el nombre de tu primera escuela?",
  "¿Cuál es tu comida favorita?",
  "¿Cuál es tu color favorito?",
  "¿Cuál es tu libro favorito?",
];
const REGIONES = ["en-US", "es-ES", "fr-FR", "de-DE", "it-IT"];
const ROLES = ["admin", "cliente"];
const PAISES = [
  "Argentina",
  "Australia",
  "Brasil",
  "Canadá",
  "Chile",
  "China",
  "Colombia",
  "España",
  "Estados Unidos",
  "Francia",
  "India",
  "Italia",
  "Japón",
  "México",
  "Perú",
  "Reino Unido",
  "Rusia",
  "Sudáfrica",
  "Uruguay",
  "Venezuela",
];
const ESTADOS_SUSCRIPCION = ["Premium", "Gratis"];

const DireccionSchema = new Schema({
  calle: { type: String },
  ciudad: { type: String },
  estado: { type: String },
  codigoPostal: { type: String },
  pais: { type: String, enum: PAISES },
});

const PreguntaSeguridadSchema = new Schema({
  pregunta: { type: String, enum: PREGUNTAS_SEGURIDAD },
  respuesta: { type: String },
});

const EnlacesRedesSocialesSchema = new Schema({
  twitter: { type: String },
  linkedin: { type: String },
});

const NotificacionesSchema = new Schema({
  email: { type: Boolean, default: false },
  sms: { type: Boolean, default: false },
});

const PreferenciasSchema = new Schema({
  idioma: { type: String, enum: IDIOMAS, default: IDIOMAS[0] },
  tema: { type: String, enum: TEMAS, default: TEMAS[0] },
});

const UsuarioSchema = new Schema({
  id: { type: Number, unique: true, required: true },
  nombreUsuario: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  contrasenia: { type: String, required: true, select: false },
  login: { type: Boolean, default: false },
  bloqueado: { type: Boolean, default: false },
  tipoRegistro: { type: String, enum: ["normal", "google"], default: "normal" },
  verificacionEmail: { type: Boolean, default: false },
  nombre: { type: String },
  apellido: { type: String },
  fechaNacimiento: {
    type: Date, validate: {
      validator: function (v) { return v < new Date(); },
      message: "La fecha de nacimiento no puede estar en el futuro."
    }
  },
  direccion: { type: DireccionSchema },
  telefono: { type: String, match: [/^\+?[0-9]{7,15}$/, "Número de teléfono inválido"] },
  fotoPerfil: { type: String },
  fotosPerfil: { type: [String], default: [] },
  rol: { type: String, enum: ROLES, required: true, default: "cliente" },
  ultimoIngreso: { type: Date },
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date },
  estaActivo: { type: Boolean, default: true },
  preferencias: { type: PreferenciasSchema, default: {} },
  preguntaSeguridad: { type: PreguntaSeguridadSchema },
  biografia: { type: String },
  enlacesRedesSociales: { type: EnlacesRedesSocialesSchema },
  estadoSuscripcion: {
    type: String,
    enum: ESTADOS_SUSCRIPCION,
    default: "Gratis",
  },
  notificaciones: { type: NotificacionesSchema, default: { email: false, sms: false } },
  autenticacionDosFactores: { type: Boolean, default: false },
  region: { type: String, enum: REGIONES },
  idCarrito: { type: mongoose.Schema.Types.ObjectId, ref: "cart" },
  idFavoritos: { type: mongoose.Schema.Types.ObjectId, ref: "fav" },
  mascotas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Animal" }],
}, { timestamps: true });

const Usuario = model("Usuario", UsuarioSchema);

export default Usuario;
