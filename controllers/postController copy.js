import Post from '../models/Post.js';
import Espacio from '../models/Espacio.js';

const obtenerPost = async (req, res) => {
  const { id } = req.params;
  const postExistente = await Post.findById(id).populate('post_espacio');

  if (!postExistente) {
    const error = new Error('Post no encontrado');
    return res.status(404).json({ message: error.message });
  }

  if (postExistente.post_espacio.esp_seguidores.indexOf(req.usuario._id) === -1) {
    const error = new Error('Acción no valida');
    return res.status(404).json({ message: error.message });
  }

  res.json({ postExistente });
}

const crearPost = async (req, res) => {
  const { post_espacio } = req.body;

  const espacioExistente = await Espacio.findById(post_espacio);
  if (!espacioExistente) {
    return res.status(404).json({ message: 'Espacio no encontrado.' });
  }

  if (espacioExistente.esp_seguidores.indexOf(req.usuario._id) === -1) {
    return res.status(401).json({ message: 'Acción no valida.' });
  }

  try {
    const nuevoPost = await Post.create(req.body);
    res.json({ message: 'Post creado correctamente', nuevoPost });
  } catch (error) {
    console.log(error);      
  }
}

const actualizarPost = async (req, res) => {
  const { id } = req.params;
  let postExistente
  try {
    postExistente = await Post.findById(id);
  } catch (error) {
    return res.status(404).json({ message: "Algo salio mal con esta acción." });
  }

  if (!postExistente) {
    const error = new Error('Post no encontrado');
    return res.status(404).json({ message: error.message });
  }

  if (postExistente.post_creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no valida');
    return res.status(404).json({ message: error.message });
  }

  postExistente.post_titulo = req.body.post_titulo || postExistente.post_titulo;
  postExistente.post_contenido = req.body.post_contenido || postExistente.post_contenido;

  try {
    const postActualizado = await postExistente.save();
    res.json({ message: 'Post actualizado correctamente', postActualizado }); 
  } catch (error) {
    console.log(error);
  }

}

const eliminarPost = async (req, res) => {
  const { id } = req.params;
  let postExistente
  try {
    postExistente = await Post.findById(id);
  } catch (error) {
    return res.status(404).json({ message: "Algo salio mal con esta acción." });
  }

  if (!postExistente) {
    const error = new Error('Post no encontrado');
    return res.status(404).json({ message: error.message });
  }

  if (postExistente.post_creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no valida');
    return res.status(404).json({ message: error.message });
  }

  try {
    await postExistente.deleteOne();
    res.json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    console.log(error);
  }

}

const actualizarLike = async (req, res) => {}

const agregarRespuesta = async (req, res) => {}

const eliminarRespuesta = async (req, res) => {}

export {  obtenerPost, crearPost, actualizarPost, eliminarPost, agregarRespuesta, eliminarRespuesta };