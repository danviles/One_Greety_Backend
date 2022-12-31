import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    post_creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    post_espacio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Espacio",
    },
    post_titulo: {
      type: String,
      required: true,
    },
    post_contenido: {
      type: String,
      required: true,
    },
    post_likes: {
      type: Number,
      default: 0,
    },
    post_comentarios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Respuesta",
      },
    ],
    post_media_img: [
      {
        type: String,
      },
    ],
    post_media_id: [
      {
        type: String,
      },
    ],
    post_tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
