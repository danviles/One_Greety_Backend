import express from "express";
import {
  obtenerPost, 
  crearPost, 
  actualizarPost, 
  eliminarPost, 
  agregarRespuesta, 
  eliminarRespuesta
} from "../controllers/postController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router
  .route("/")
  .post(checkAuth, crearPost);
router
  .route("/:id")
  .get(checkAuth, obtenerPost)
  .put(checkAuth, actualizarPost)
  .delete(checkAuth, eliminarPost);
router.post("/:id/respuestas", checkAuth, agregarRespuesta)
router.post("/:id/respuestas/:idRespuesta", checkAuth, eliminarRespuesta);

export default router;