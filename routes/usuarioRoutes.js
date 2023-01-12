import express from "express";
import {
  registrar,
  autenticar,
  confirmar,
  recuperarPassword,
  comprobarToken,
  nuevoPassword,
  perfil,
  editarPerfil,
  obtenerPerfilUsuario
} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/", registrar);
router.post("/login", autenticar);
router.get("/confirmar/:token", confirmar);
router.post("/recuperar-password", recuperarPassword);
router.route("/recuperar-password/:token").get(comprobarToken).post(nuevoPassword);
router.get("/perfil", checkAuth, perfil)
router.put("/perfil/:id", checkAuth, editarPerfil)
router.get("/perfil/usuario/:id", obtenerPerfilUsuario)


export default router;
