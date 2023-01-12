import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = new mongoose.Schema(
  {
    usu_nombre: {
      type: String,
      required: true,
      trim: true,
    },
    usu_email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    usu_password: {
      type: String,
      required: true,
      trim: true,
    },
    usu_token: {
      type: String,
    },
    usu_confirmado: {
      type: Boolean,
      default: false,
    }, 
    usu_rol: {
      type: String,
      default: "usuario",
      enum: ["usuario", "administrador", "colaborador"],
    },
    usu_espacios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Espacio",
      }
    ],
    usu_esp_colaborador: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Espacio",
      }
    ],
    usu_perfil_img: {
      type: String,
      default:
        "https://res.cloudinary.com/dbuwevjad/image/upload/v1661278251/swo2vuybriyddfnuiyst.png",
    },
    usu_img_id: {
      type: String,
    },
    usu_region: {
      type: String,
      default: "Global",
    },
    usu_twitter: {
      type: String,
    },
    usu_tiktok: {
      type: String,
    },
    usu_youtube: {
      type: String,
    },
    usu_instagram: {
      type: String,
    },
    usu_spotify: {
      type: String,
    },
    usu_soundcloud: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("usu_password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.usu_password = await bcrypt.hash(this.usu_password, salt);
});

usuarioSchema.methods.comprobarPassword = async function (password) {
  return await bcrypt.compare(password, this.usu_password);
}

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;