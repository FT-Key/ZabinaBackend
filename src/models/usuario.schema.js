import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const IDIOMAS = ["Español", "Inglés", "Francés", "Alemán", "Italiano", "Ruso"];
const TEMAS = ["Claro", "Oscuro"];
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
  "Otro"
];
const REDES_SOCIALES = [
  "Twitter",
  "LinkedIn",
  "Instagram",
  "Facebook",
  "GitHub",
  "YouTube",
  "TikTok",
  "Reddit",
  "Otra"
];

const DireccionSchema = new Schema({
  calle: { type: String },
  ciudad: { type: String },
  estado: { type: String },
  codigoPostal: { type: String },
  pais: { type: String, enum: PAISES },
});

const EnlacesRedesSocialesSchema = new Schema({
  nombreRed: { type: String, enum: REDES_SOCIALES, required: true },
  enlace: { type: String, required: true }
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
  nombreUsuario: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  contrasenia: { type: String, required: true, select: false },
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
  rol: { type: String, enum: ROLES, required: true, default: "cliente" },
  estaActivo: { type: Boolean, default: true },
  preferencias: { type: PreferenciasSchema, default: {} },
  enlacesRedesSociales: { type: [EnlacesRedesSocialesSchema], default: [] },
  notificaciones: { type: NotificacionesSchema, default: { email: false, sms: false } },
  idCarrito: { type: mongoose.Schema.Types.ObjectId, ref: "cart" },
  idFavoritos: { type: mongoose.Schema.Types.ObjectId, ref: "fav" },
}, { timestamps: true });

const Usuario = model("Usuario", UsuarioSchema);

export default Usuario;
