import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import { multerUpload } from "../config/multer.js";
import {
  uploadImage,
  editImage,
  deleteImage,
} from "../controllers/filesController.js";

const router = express.Router();

// Upload and update images
router.post("/", checkAuth, multerUpload.single("file"), uploadImage);
router.put("/", checkAuth, multerUpload.single("file"), editImage);
router.post('/eliminar', checkAuth, deleteImage);

export default router;