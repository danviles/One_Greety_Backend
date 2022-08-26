import cloudinary from "cloudinary";

const connectCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("Cloudinary connected");
  } catch (error) {
    console.log("Cloudinary connection error");
    console.log(error);
    process.exit(1);
  }
};

export default connectCloudinary;