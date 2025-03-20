import { Schema, model as _model } from 'mongoose';

const productoSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  tipo: { type: String, required: true }, // 'ropa' o 'uñas'
  precio: { type: Number, required: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  cantidadEnStock: { type: Number, required: true },
  fechaDeIngreso: { type: Date, required: true },
  proveedor: { type: String, required: true },
  codigoDeBarras: { type: String, required: true, unique: true },
  imagenUrl: { type: String, required: true },
  imagenesUrls: { type: [String], default: [] },
  calificaciones: { type: Number, required: true, min: 0, max: 5 },
  resenias: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  garantia: { type: String, required: true },
  descuento: { type: Number, required: true, min: 0, max: 100 },
  bloqueado: { type: Boolean, required: true },
  tallasDisponibles: {
    type: [String],
    default: [],
    validate: {
      validator: function () {
        return this.tipo !== 'ropa' || (this.tallasDisponibles && this.tallasDisponibles.length > 0);
      },
      message: 'Las tallas son obligatorias para productos de tipo ropa.',
    },
  },
  coloresDisponibles: {
    type: [String],
    default: [],
    validate: {
      validator: function () {
        return this.tipo !== 'ropa' || (this.coloresDisponibles && this.coloresDisponibles.length > 0);
      },
      message: 'Los colores son obligatorios para productos de tipo ropa.',
    },
  },
});

const Producto = _model('Producto', productoSchema);

export default Producto;