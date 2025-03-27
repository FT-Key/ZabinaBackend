import mongoose from "mongoose";
import { model } from "mongoose";

const CartSchema = new mongoose.Schema({
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

const CartModel = model('cart', CartSchema);

export default CartModel;