import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const generateJwtToken = (userInfo) => {
  const payload = {
    _id: userInfo._id,
    id: userInfo.id,
    nombreUsuario: userInfo.nombreUsuario,
    email: userInfo.email,
    rol: userInfo.rol,
    nombre: userInfo.nombre || "",
    apellido: userInfo.apellido || "",
    fotoPerfil: userInfo.fotoPerfil || "",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });
};

export const verifyPassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error("Error al verificar la contraseña");
  }
};