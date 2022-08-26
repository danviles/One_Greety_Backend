import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const checkAuth = async (req, res, next) => {
  let token;

  if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer") ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decodificarToken = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = await Usuario.findById(decodificarToken._id).select("-usu_password -__v -updatedAt -usu_confirmado -usu_token");
      return next();
    } catch (error) {
      return res.status(404).json({ msg: "Token no valido o expirado." });
    }
  }

  if (!token) {
    const error = new Error("No hay token");
    return res.status(401).json({ msg: error.message });
  }
  next();
};

export default checkAuth;