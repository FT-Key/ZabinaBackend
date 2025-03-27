import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Se conectó la base de datos'))
  .catch((error) => console.log('Error al conectar base de datos: ', error));