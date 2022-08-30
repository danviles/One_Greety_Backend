import express from "express";
import {
  obtenerEspacios, 
  obtenerEspacio, 
  crearEspacio, 
  actualizarEspacio, 
  eliminarEspacio, 
  agregarColaborador, 
  eliminarColaborador,
  buscarUsuario,
  agregarPeticion,
  rechazarPeticion,
  aceptarPeticion,
  aceptarPeticiones,
  agregarBaneo,
  eliminarBaneo,
  obtenerTodosEspacios,
  obtenerUnicoEspacio
} from "../controllers/espacioController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/todos", obtenerTodosEspacios); 
router.get("/unico/:id", obtenerUnicoEspacio); 

router
.route("/")
.get(checkAuth, obtenerEspacios)
.post(checkAuth, crearEspacio);
router
.route("/:id")
.get(checkAuth, obtenerEspacio)
.put(checkAuth, actualizarEspacio)
.delete(checkAuth, eliminarEspacio);


router.post("/busqueda-usuarios", checkAuth, buscarUsuario);

router.post("/colaboradores/:id", checkAuth, agregarColaborador);
router.post("/eliminar-colaboradores/:id", checkAuth, eliminarColaborador);

router.post("/peticiones/:id", checkAuth, agregarPeticion);
router.post("/rechazar-peticion/:id", checkAuth, rechazarPeticion);
router.post("/aceptar-peticion/:id", checkAuth, aceptarPeticion);
router.get("/aceptar-peticiones/:id", checkAuth, aceptarPeticiones);

router.post("/baneos/:id", checkAuth, agregarBaneo);
router.post("/eliminar-baneo/:id", checkAuth, eliminarBaneo);



export default router;