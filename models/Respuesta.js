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
    res_media: [
      {
        type: string,
      },
    ],
    res_comentarios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Respuesta",
      },
    ],
    res_likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Respuesta = mongoose.model("Respuesta", respuestaSchema);
export default Respuesta;