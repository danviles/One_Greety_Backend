import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailRecuperarPassword } from "../helpers/email.js";

const registrar = async (req, res) => {
  req.body.usu_email = req.body.usu_email.toLowerCase();
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
    emailRegistro({
      nombre: nuevoUsuario.usu_nombre,
      email: nuevoUsuario.usu_email,
      token: nuevoUsuario.usu_token
    });
    res.json({
      msg: "Usuario registrado correctamente, se ha enviado un email para confirmar el registro."
    });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  req.body.usu_email = req.body.usu_email.toLowerCase();
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
    // res.json({
    //   _id: usuario._id,
    //   usu_nombre: usuario.nombre,
    //   usu_email: usuario.email,
    //   usu_perfil_img: usuario.usu_perfil_img,
    //   usu_token: generarJWT({
    //     _id: usuario._id,
    //   }),
    // });
    usuario.usu_token = generarJWT({
      _id: usuario._id,
    });
    res.json(usuario);
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
  req.body.usu_email = req.body.usu_email.toLowerCase();
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

  if (!usuario) {
    const error = new Error("Token no valido.");
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
  const usuperfil = await Usuario.findById(usuario._id)
  .populate({path: "usu_espacios", populate: {path: "esp_administrador", select: "usu_nombre usu_perfil_img"}})
  res.json(usuperfil);
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
  usuario.usu_twitter = req.body.usu_twitter;
  usuario.usu_tiktok = req.body.usu_tiktok;
  usuario.usu_instagram = req.body.usu_instagram;
  usuario.usu_spotify = req.body.usu_spotify;
  usuario.usu_soundcloud = req.body.usu_soundcloud;
  usuario.usu_youtube = req.body.usu_youtube;


  const usuarioAct = await usuario.save();
  res.json({ msg: "Perfil actualizado correctamente.", usuario: usuarioAct });

}

const obtenerPerfilUsuario = async (req, res) => {
  const { id } = req.params;
  const usuario = await Usuario.findById(id)
  .select("-usu_confirmado -createdAt -usu_password -usu_token -updatedAt -usu_img_id -usu_region -__v ")
  .populate({path: "usu_espacios", populate: {path: "esp_administrador", select: "-usu_confirmado -usu_password -usu_token -usu_rol -usu_espacios -usu_esp_colaborador -usu_img_id -createdAt -updatedAt -__v"}})


  if (!usuario) {
    return res.status(404).json({ msg: "Usuario no encontrado." });
  }

  res.json(usuario);
}


export { registrar, autenticar, confirmar, recuperarPassword, comprobarToken, nuevoPassword, perfil, editarPerfil, obtenerPerfilUsuario, };
