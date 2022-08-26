import Usuario from "../models/Usuario.js";
import generarId from "../helpers/GenerarId.js";
import generarJWT from "../helpers/GenerarJWT.js";
import { emailRegistro, emailRecuperarPassword } from "../helpers/email.js";

const registrar = async (req, res) => {
  const { usu_email } = req.body;
  const usuario = await Usuario.findOne({ usu_email });

  // Confirmo si el usuario ya existe
  if (usuario) {
    const error = new Error("El usuario ya esta registrado");
    return res.status(400).json({ msg: error.message });
  }

  // Registro el usuario
  try {
    const nuevoUsuario = new Usuario(req.body);
    nuevoUsuario.usu_token = generarId();
    await nuevoUsuario.save();

    // Envio el email de confirmacion
    emailRegistro({nombre: nuevoUsuario.usu_nombre, email: nuevoUsuario.usu_email, token: nuevoUsuario.usu_token});
    res.json({
      msg: "Usuario registrado correctamente, se ha enviado un email para confirmar el registro."
    });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { usu_email, usu_password } = req.body;
  const usuario = await Usuario.findOne({ usu_email });

  // Compruebo si el usuario existe
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  // Compruebo si el usuario esta confirmado
  if (!usuario.usu_confirmado) {
    const error = new Error("El usuario no esta confirmado");
    return res.status(403).json({ msg: error.message });
  }

  // Compruebo si el password es correcto
  if (await usuario.comprobarPassword(usu_password)) {
    res.json({
      _id: usuario._id,
      usu_nombre: usuario.nombre,
      usu_email: usuario.email,
      usu_token: generarJWT({
        _id: usuario._id,
      }),
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  
  // Compruebo si el Token esta asociado a un usuario
  const usuario = await Usuario.findOne({ usu_token: token });
  if (!usuario) {
    const error = new Error("Token no valido");
    return res.status(403).json({ msg: error.message });
  }

  // Confirmo el usuario
  try {
    usuario.usu_confirmado = true;
    usuario.usu_token = "";
    const guardarUsuario = await usuario.save();
    res.json({
      msg: "Usuario confirmado correctamente",
      usuario: guardarUsuario,
    });
  } catch (error) {
    console.log(error);
  }
};

const recuperarPassword = async (req, res) => {
  const { usu_email } = req.body;
  const usuario = await Usuario.findOne({ usu_email });

  // Compruebo si el usuario existe
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.usu_token = generarId();
    await usuario.save();
    emailRecuperarPassword({nombre: usuario.usu_nombre, email: usuario.usu_email, token: usuario.usu_token});
    res.json({ msg: "Se ha enviado un email con las instrucciones para recuperar la contraseña" });
  } catch (error) {
    console.log(error);
  }
}

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({usu_token: token});
  console.log(token)

  if (!usuario) {
    const error = new Error("Token no valido.");
    console.log
    return res.status(403).json({ msg: error.message });
  }

  res.json({ msg: "Token valido." });
}

const nuevoPassword = async (req, res) => {
  const { usu_password } = req.body;
  const { token } = req.params;
  const usuario = await Usuario.findOne({ token });

  if (!usuario) { 
    const error = new Error("Token no valido.");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.usu_password = usu_password;
    usuario.usu_token = '';
    await usuario.save();
    res.json({ msg: "Contraseña cambiada correctamente." });
  } catch (error) {
    console.log(error);
  }
}

const perfil = async (req, res) => {
  const { usuario } = req;
  res.json(usuario);
}

const editarPerfil = async (req, res) => {
  const { id } = req.params;
  const usuario = await Usuario.findById(id);

  if (!usuario) {
    return res.status(404).json({ msg: "Usuario no encontrado." });
  }

  if (usuario._id.toString() !== req.usuario._id.toString()) {
    return res.status(401).json({ msg: "Acción no valida." });
  }

  usuario.usu_nombre = req.body.usu_nombre || usuario.usu_nombre;
  usuario.usu_password = req.body.usu_password || usuario.usu_password;
  usuario.usu_region = req.body.usu_region || usuario.usu_region;
  usuario.usu_perfil_img = req.body.usu_perfil_img || usuario.usu_perfil_img;
  usuario.usu_img_id = req.body.usu_img_id || usuario.usu_img_id;

  const usuarioAct = await usuario.save();
  res.json({ msg: "Perfil actualizado correctamente.", usuario: usuarioAct });

}

export { registrar, autenticar, confirmar, recuperarPassword, comprobarToken, nuevoPassword, perfil, editarPerfil };
