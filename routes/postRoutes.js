import express from "express";
import {
  obtenerPost, 
  crearPost, 
  actualizarPost, 
  eliminarPost, 
  destacarPost,
  agregarRespuesta, 
  eliminarRespuesta,
  actualizarLike
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
router.post("/:id/likes", checkAuth, actualizarLike);
router.get("/:id/destacar", checkAuth, destacarPost); 

export default router;