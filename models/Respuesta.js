import mongoose from "mongoose";

const respuestaSchema = new mongoose.Schema(
  {
    res_creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true
    },
    res_post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    res_contenido: {
      type: String,
      required: true,
    },
    res_media_img: 
      {
        type: String,
      },
    res_media_id: 
      {
        type: String,
      },
    res_comentarios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Respuesta",
      },
    ],
    post_likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Respuesta = mongoose.model("Respuesta", respuestaSchema);
export default Respuesta;