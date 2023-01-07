import Post from '../models/Post.js';
import Espacio from '../models/Espacio.js';
import Respuesta from '../models/Respuesta.js';

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

  const nuevoPost = new Post(req.body);
  nuevoPost.post_creador = req.usuario._id;
  espacioExistente.esp_foro.push(nuevoPost._id);
  try {
    await espacioExistente.save();
    await nuevoPost.save();
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
  // postExistente.post_media_img = req.body.post_media_img || postExistente.post_media_img;
  // postExistente.post_media_id = req.body.post_media_id || postExistente.post_media_id;
  // postExistente.post_tags = req.body.post_tags || postExistente.post_tags;
  // postExistente.post_respuestas = req.body.post_respuestas || postExistente.post_respuestas;
  // postExistente.post_likes = req.body.post_likes || postExistente.post_likes;
  // postExistente.post_espacio = req.body.post_espacio || postExistente.post_espacio;
  // postExistente.post_creador = req.body.post_creador || postExistente.post_creador;

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

const actualizarLike = async (req, res) => {
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

  const index = postExistente.post_likes.indexOf(req.usuario._id);	
  if (index === -1) {
    postExistente.post_likes.push(req.usuario._id);
  } else {
    postExistente.post_likes.splice(index, 1);
  }

  try {
    const postActualizado = await postExistente.save();
    res.json({ message: 'Post actualizado correctamente', postActualizado }); 
  } catch (error) {
    console.log(error);
  }
}

const agregarRespuesta = async (req, res) => {

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

  const nuevaRespuesta = new Respuesta(req.body);
  nuevaRespuesta.res_creador = req.usuario._id;
  nuevaRespuesta.res_post = id;
  postExistente.post_comentarios.push(nuevaRespuesta._id);

  try {
    await nuevaRespuesta.save();
    await postExistente.save();
    res.json({ message: 'Respuesta agregada correctamente', nuevaRespuesta });
  } catch (error) {
    console.log(error);      
  }

}

const eliminarRespuesta = async (req, res) => {
  const { id, idRespuesta } = req.params;

  const postExistente = await Post.findById(id).populate('post_espacio');

  if (!postExistente) {
    const error = new Error('Post no encontrado');
    return res.status(404).json({ message: error.message });
  }

  if (postExistente.post_espacio.esp_seguidores.indexOf(req.usuario._id) === -1) {
    const error = new Error('Acción no valida');
    return res.status(404).json({ message: error.message });
  }

  const respuestaExistente = await Respuesta.findById(idRespuesta);
  
  if (!respuestaExistente) {
    const error = new Error('Respuesta no encontrada');
    return res.status(404).json({ message: error.message });
  }

  if (respuestaExistente.res_creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no valida');
    return res.status(404).json({ message: error.message });
  }

  const index = postExistente.post_respuestas.indexOf(idRespuesta);
  postExistente.post_respuestas.splice(index, 1);

  try {
    await respuestaExistente.deleteOne();
    await postExistente.save();
    res.json({ message: 'Respuesta eliminada correctamente' });
  } catch (error) {
    console.log(error);
  }
}

export {  obtenerPost, crearPost, actualizarPost, eliminarPost, agregarRespuesta, eliminarRespuesta, actualizarLike };