import mongoose from "mongoose";

const comentarioSchema = new mongoose.Schema({
  texto: {
    type: String,
    required: true,
  },
  calificacion: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {timestamps: true});

const Comentario = mongoose.model('Comentario', comentarioSchema);

export default Comentario;