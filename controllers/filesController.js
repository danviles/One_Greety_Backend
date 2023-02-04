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
  await cloudinary.v2.uploader.destroy(req.body.imgId);
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  await fs.unlink(req.file.path);
  res.send({
    url: result.url.replace(/http/g, "https"),
    publicId: result.public_id
  });
}

const deleteImage = async (req, res) => {
  const result = await cloudinary.v2.uploader.destroy(req.body.imgId);
  res.send({
    message: "Image deleted"
  });
}

export { uploadImage, editImage, deleteImage };