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
    console.log(origin);
    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Acceso no permitido por CORS ${origin}`));
    }
  },
};

app.use(cors());
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/espacios", espacioRoutes);
app.use("/api/foros", postRoutes);

app.use("/api/files", filesRoutes);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Socket.io

import { Server } from "socket.io";

const io = new Server(server, {
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  console.log("Usuario conectado socket.io");
  
  socket.on("chat room", (espacio_id) => {
    console.log('id' + espacio_id);
    socket.join(espacio_id);
  });

  socket.on("chat msg", (espacio_id, chatMsgs) => {
    console.log('chat msg', espacio_id, chatMsgs);
    io.to(espacio_id).emit("chat actualizado", espacio_id, chatMsgs);
  });
});
