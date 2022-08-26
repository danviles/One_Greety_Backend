import express from "express";
import conectarDB from "./config/dB.js";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import espacioRoutes from "./routes/espacioRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import filesRoutes from "./routes/filesRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import cors from "cors";


const app = express();
app.use(express.json());

dotenv.config();

conectarDB();
connectCloudinary();

const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Acceso no permitido por CORS ${origin}`));
    }
  }
};


app.use(cors());
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/espacios", espacioRoutes);
app.use("/api/foros", postRoutes);

app.use("/api/files",  filesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
