import mongoose from 'mongoose';
import { TIPOS_ATENCION, ESTADOS_TURNO, MODALIDADES } from '../mocks/turnos.mock.js';

const turnoSchema = new mongoose.Schema({
  hora: {
    type: String,
    required: true
  },
  tipoAtencion: {
    type: String,
    enum: TIPOS_ATENCION,
    required: true
  },
  estado: {
    type: String,
    enum: ESTADOS_TURNO,
    default: 'libre'
  },
  modalidad: {
    type: String,
    enum: MODALIDADES,
    default: 'online',
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false 
  },
  descripcion: {
    type: String,
  }
}, {timestamps: true});

const fechaTurnoSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    unique: true,
    required: true
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  turnos: [turnoSchema],
  creadoEn: {
    type: Date,
    default: Date.now
  },
  actualizadoEn: {
    type: Date
  }
}, {timestamps: true});

const FechaTurnoModel = mongoose.model('FechaTurno', fechaTurnoSchema);

export default FechaTurnoModel;