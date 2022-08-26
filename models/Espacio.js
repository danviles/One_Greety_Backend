import mongoose from "mongoose";

const espacioSchema = new mongoose.Schema({
    esp_nombre: {
      type: String,
      required: true,
    },
    esp_descripcion: {
      type: String,
      required: true,
    },
    esp_img_portada: {
      type: String,
      default: "https://res.cloudinary.com/dbuwevjad/image/upload/v1661285616/default-espacio_gwhseh.jpg",
    },
    esp_img_id: {
      type: String,
    },
    esp_administrador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    esp_seguidores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      }
    ],
    esp_baneados: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      }
    ],
    esp_peticiones: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      }
    ],
    esp_colaboradores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      }
    ],
    esp_region: {
      type: String,
      default: "Global",    
    },
    esp_acceso: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

const Espacio = mongoose.model("Espacio", espacioSchema);
export default Espacio;