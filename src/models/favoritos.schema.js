import mongoose from "mongoose";
import { model } from "mongoose";

const FavSchema = new mongoose.Schema({
  idUsuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  productos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
    }
  ],
}, {timestamps: true});

const FavModel = model('fav', FavSchema);

export default FavModel;