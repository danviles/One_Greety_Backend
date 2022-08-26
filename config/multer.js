import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const multerUpload = multer({
  dest: path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../public/uploads"
  ),
  filename: (req, file, cb, filename) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

// const storage = multer.diskStorage({
//   destination: path.join(
//     path.dirname(fileURLToPath(import.meta.url)),
//     "../../public"
//   ),
//   filename: function (req, file, cb) {
//     cb(null, 'app-release.apk');
//   },
// });

// const multerUploadAPK = multer({ storage: storage });

export { multerUpload };