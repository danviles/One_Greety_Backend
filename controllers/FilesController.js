import cloudinary from "cloudinary";
import fs from "fs-extra";

const uploadImage = async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  await fs.unlink(req.file.path);
  res.send({
    url: result.url.replace(/http/g, "https"),
    publicId: result.public_id
  });
}

const editImage = async (req, res) => {
  console.log(req.body.imgId)
  await cloudinary.v2.uploader.destroy(req.body.imgId);
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  await fs.unlink(req.file.path);
  res.send({
    url: result.url.replace(/http/g, "https"),
    publicId: result.public_id
  });
}

export { uploadImage, editImage };