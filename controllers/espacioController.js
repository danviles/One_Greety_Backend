import Espacio from "../models/Espacio.js";
import Usuario from "../models/Usuario.js";
import cloudinary from "cloudinary";

const obtenerEspacios = async (req, res) => {
  if(req.usuario){
    const espacios = await Espacio.find({ 
      $or: [
        {esp_administrador: { $in: req.usuario._id}},
        {esp_colaboradores: { $in: req.usuario._id}}
      ]
    });
    res.json(espacios);
  }
};

const obtenerEspacio = async (req, res) => {
  const { id } = req.params;
  const espacio = await Espacio.findById(id)
    .populate("esp_colaboradores", "usu_nombre usu_email usu_perfil_img")
    .populate("esp_baneados")
    .populate("esp_peticiones")
    .populate("esp_foro")
    .populate("esp_seguidores", "usu_nombre usu_email usu_perfil_img");

  if (!espacio) {
    return res.status(404).json({ msg: "Espacio no encontrado." });
  }

  if (
    espacio.esp_administrador.toString() !== req.usuario._id.toString() &&
    !espacio.esp_colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    const error = new Error("Acción No Válida");
    return res.status(401).json({ msg: error.message });
  }

  res.json(espacio);
};

const crearEspacio = async (req, res) => {
  const nuevoEspacio = new Espacio(req.body);
  nuevoEspacio.esp_administrador = req.usuario._id;
  nuevoEspacio.esp_seguidores = [req.usuario._id];

  try {
    const espacioCreado = await nuevoEspacio.save();
    res.json({ msg: "Espacio creado correctamente", espacio: espacioCreado });
  } catch (error) {
    console.log(error);
  }
};

const actualizarEspacio = async (req, res) => {
  const { id } = req.params;
  const espacio = await Espacio.findById(id);

  if (!espacio) {
    return res.status(404).json({ msg: "Espacio no encontrado." });
  }

  if (espacio.esp_administrador.toString() !== req.usuario._id.toString()) {
    return res.status(401).json({ msg: "Acción no valida." });
  }

  espacio.esp_nombre = req.body.esp_nombre || espacio.esp_nombre;
  espacio.esp_descripcion = req.body.esp_descripcion || espacio.esp_descripcion;
  espacio.esp_img_portada = req.body.esp_img_portada || espacio.esp_img_portada;
  espacio.esp_region = req.body.esp_region || espacio.esp_region;
  espacio.esp_acceso = req.body.esp_acceso;
  espacio.esp_seguidores = req.body.esp_seguidores || espacio.esp_seguidores;
  espacio.esp_peticiones = req.body.esp_peticiones || espacio.esp_peticiones;
  espacio.esp_colaboradores =
    req.body.esp_colaboradores || espacio.esp_colaboradores;
  espacio.esp_img_id = req.body.esp_img_id || espacio.esp_img_id;
  espacio.esp_img_portada = req.body.esp_img_portada || espacio.esp_img_portada;

  try {
    const espacioActualizado = await espacio.save();
    res.json({
      msg: "Espacio actualizado correctamente",
      espacio: espacioActualizado,
    });
  } catch (error) {
    console.log(error);
  }
};

const eliminarEspacio = async (req, res) => {
  const { id } = req.params;
  const espacio = await Espacio.findById(id);

  if (!espacio) {
    return res.status(404).json({ msg: "Espacio no encontrado." });
  }

  if (espacio.esp_administrador.toString() !== req.usuario._id.toString()) {
    return res.status(401).json({ msg: "Acción no valida." });
  }

  try {
    await cloudinary.v2.uploader.destroy(espacio.esp_img_id);
    await espacio.deleteOne();
    res.json({ msg: "Espacio eliminado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const buscarUsuario = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ usu_email: email }).select(
    "-usu_confirmado -usu_password -usu_token -usu_rol -usu_espacios -usu_esp_colaborador -updatedAt -createdAt -__v "
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  res.json(usuario);
};

const agregarColaborador = async (req, res) => {
  const espacio = await Espacio.findById(req.params.id);

  // Verifico si existe el espacio
  if (!espacio) {
    const error = new Error("Espacio No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  // Solo el administrador puede agregar colaboradores
  if (espacio.esp_administrador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  const { _id } = req.body;
  const usuario = await Usuario.findOne({ _id }).select(
    "-usu_confirmado -createdAt -usu_password -usu_token -updatedAt -__v "
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  // El colaborador no es el admin del espacio
  if (espacio.esp_administrador.toString() === usuario._id.toString()) {
    const error = new Error("El Creador del Espacio no puede ser colaborador");
    return res.status(404).json({ msg: error.message });
  }

  // Revisar que no este ya agregado al espacio
  if (espacio.esp_colaboradores.includes(usuario._id)) {
    const error = new Error("El usuario ya es colaborador de este espacio");
    return res.status(404).json({ msg: error.message });
  }

  // Esta bien, se puede agregar
  espacio.esp_colaboradores.push(usuario._id);
  usuario.usu_esp_colaborador.push(espacio._id);
  await espacio.save();
  await usuario.save();
  res.json({ msg: "Colaborador Agregado Correctamente" });
};

const eliminarColaborador = async (req, res) => {
  const espacio = await Espacio.findById(req.params.id);

  if (!espacio) {
    const error = new Error("Espacio No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (espacio.esp_administrador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  const { _id } = req.body;
  const usuario = await Usuario.findOne({ _id }).select(
    "-usu_confirmado -createdAt -usu_password -usu_token -updatedAt -__v "
  );

  // Esta bien, se puede eliminar
  espacio.esp_colaboradores.pull(req.body._id);
  usuario.usu_esp_colaborador.pull(req.params.id);
  await espacio.save();
  await usuario.save();
  res.json({ msg: "Colaborador Eliminado Correctamente" });
};

const agregarPeticion = async (req, res) => {
  const espacio = await Espacio.findById(req.params.id);

  if (!espacio) {
    const error = new Error("Espacio No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  const { _id } = req.body;
  const usuario = await Usuario.findOne({ _id }).select(
    "-usu_confirmado -createdAt -usu_password -usu_token -updatedAt -__v "
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (espacio.esp_seguidores.includes(usuario._id)) {
    const error = new Error("El Usuario ya es seguidor de este espacio.");
    return res.status(404).json({ msg: error.message });
  }

  if (espacio.esp_peticiones.includes(usuario._id)) {
    const error = new Error("El Usuario tiene pendiente su aprobación.");
    return res.status(404).json({ msg: error.message });
  }

  if (espacio.esp_baneados.includes(usuario._id)) {
    const error = new Error("El Usuario esta expulsado del espacio.");
    return res.status(404).json({ msg: error.message });
  }

  espacio.esp_peticiones.push(usuario._id);
  await espacio.save();
  res.json({ msg: "Se ha enviado una solicitud para ingresar al club." });
};

const rechazarPeticion = async (req, res) => {
  const espacio = await Espacio.findById(req.params.id);

  if (!espacio) {
    const error = new Error("Espacio No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  const { _id } = req.body;
  const usuario = await Usuario.findOne({ _id }).select(
    "-usu_confirmado -createdAt -usu_password -usu_token -updatedAt -__v "
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (!espacio.esp_peticiones.includes(usuario._id)) {
    const error = new Error("El Usuario no tiene pendiente su aprobación");
    return res.status(404).json({ msg: error.message });
  }

  if (
    espacio.esp_administrador.toString() == req.usuario._id.toString() ||
    espacio.esp_colaboradores.includes(req.usuario._id)
  ) {
    espacio.esp_peticiones.pull(usuario._id);
    await espacio.save();
    res.json({ msg: "Petición rechazada" });
  } else {
    res.json({ msg: "No tienes permiso para realizar esta acción" });
  }
};

const aceptarPeticion = async (req, res) => {
  const espacio = await Espacio.findById(req.params.id);

  if (!espacio) {
    const error = new Error("Espacio No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  const { _id } = req.body;
  const usuario = await Usuario.findOne({ _id }).select(
    "-confirmado -createdAt -password -token -updatedAt -__v "
  );

  if (!espacio.esp_peticiones.includes(usuario._id)) {
    const error = new Error("El Usuario no tiene pendiente su aprobación");
    return res.status(404).json({ msg: error.message });
  }

  if (
    espacio.esp_administrador.toString() == req.usuario._id.toString() ||
    espacio.esp_colaboradores.includes(req.usuario._id)
  ) {
    espacio.esp_peticiones.pop(usuario._id);
    espacio.esp_seguidores.push(usuario._id);
    usuario.usu_espacios.push(espacio._id);
    await espacio.save();
    await usuario.save();
    res.json({ msg: "Petición aceptada" });
  } else {
    res.json({ msg: "No tienes permiso para realizar esta acción" });
  }
};

const aceptarPeticiones = async (req, res) => {
  const espacio = await Espacio.findById(req.params.id);

  if (!espacio) {
    const error = new Error("Espacio No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (
    espacio.esp_administrador.toString() == req.usuario._id.toString() ||
    espacio.esp_colaboradores.includes(req.usuario._id)
  ) {
    espacio.esp_peticiones.forEach(async (usuario) => {
      espacio.esp_seguidores.push(usuario);
      const usuarioAceptado = await Usuario.findOne({ _id: usuario });
      usuarioAceptado.usu_espacios.push(espacio._id);
      await usuarioAceptado.save();
    });
    espacio.esp_peticiones = [];
    await espacio.save();
    res.json({ msg: "Peticiones aceptadas" });
  } else {
    res.json({ msg: "No tienes permiso para realizar esta acción" });
  }
};

const agregarBaneo = async (req, res) => {
  const espacio = await Espacio.findById(req.params.id);

  if (!espacio) {
    const error = new Error("Espacio No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  const { _id } = req.body;
  const usuario = await Usuario.findOne({ _id }).select(
    "-usu_confirmado -createdAt -password -token -updatedAt -__v "
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (espacio.esp_baneados.includes(usuario._id)) {
    const error = new Error("El Usuario ya está baneado");
    return res.status(404).json({ msg: error.message });
  }

  if (
    espacio.esp_administrador.toString() == req.usuario._id.toString() ||
    espacio.esp_colaboradores.includes(req.usuario._id)
  ) {
    espacio.esp_baneados.push(usuario._id);
    espacio.esp_seguidores.pull(usuario._id);
    usuario.usu_espacios.pull(espacio._id);
    await espacio.save();
    res.json({ msg: "Usuario baneado" });
  } else {
    res.json({ msg: "No tienes permiso para realizar esta acción" });
  }
};

const eliminarBaneo = async (req, res) => {
  const espacio = await Espacio.findById(req.params.id);

  if (!espacio) {
    const error = new Error("Espacio No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  const { _id } = req.body;
  const usuario = await Usuario.findOne({ _id }).select(
    "-confirmado -createdAt -password -token -updatedAt -__v "
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (!espacio.esp_baneados.includes(usuario._id)) {
    const error = new Error("El Usuario no está baneado");
    return res.status(404).json({ msg: error.message });
  }

  if (
    espacio.esp_administrador.toString() == req.usuario._id.toString() ||
    espacio.esp_colaboradores.includes(req.usuario._id)
  ) {
    espacio.esp_baneados.pull(usuario._id);
    await espacio.save();
    res.json({ msg: "Usuario desbaneado" });
  } else {
    res.json({ msg: "No tienes permiso para realizar esta acción" });
  }
};

const obtenerTodosEspacios = async (req, res) => {
  const espacios = await Espacio.find({})
  .populate("esp_administrador", "-usu_confirmado -usu_password -usu_token -usu_rol -usu_espacios -usu_esp_colaborador -usu_img_id -createdAt -updatedAt -__v")
  .populate("esp_foro");
  res.json(espacios);
};

const obtenerUnicoEspacio = async (req, res) => {
  const espacio = await Espacio.findById(req.params.id)
  .populate("esp_administrador", "-usu_confirmado -usu_password -usu_token -usu_rol -usu_espacios -usu_esp_colaborador -usu_img_id -createdAt -updatedAt -__v")
  .populate("esp_foro");
  res.json(espacio);
}

const obtenerPosts = async (req, res) => {
};

export {
  obtenerEspacios,
  obtenerEspacio,
  crearEspacio,
  actualizarEspacio,
  eliminarEspacio,
  agregarColaborador,
  eliminarColaborador,
  obtenerPosts,
  buscarUsuario,
  agregarPeticion,
  rechazarPeticion,
  aceptarPeticion,
  aceptarPeticiones,
  agregarBaneo,
  eliminarBaneo,
  obtenerTodosEspacios,
  obtenerUnicoEspacio
};
