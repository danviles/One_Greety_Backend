import express from "express";
import {
  registrar,
  autenticar,
  confirmar,
  recuperarPassword,
  comprobarToken,
  nuevoPassword,
  perfil,
  editarPerfil
} from "../controllers/UsuarioController.js";
import checkAuth from "../middleware/CheckAuth.js";

const router = express.Router();

router.post("/", registrar);
router.post("/login", autenticar);
router.get("/confirmar/:token", confirmar);
router.post("/recuperar-password", recuperarPassword);
router.route("/recuperar-password/:token").get(comprobarToken).post(nuevoPassword);
router.get("/perfil", checkAuth, perfil)
router.put("/perfil/:id", checkAuth, editarPerfil)


export default router;
