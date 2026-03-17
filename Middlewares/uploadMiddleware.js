import multer from "multer";
import multerStorageCloudinary from "multer-storage-cloudinary";
import cloudinary from "../Config/cloudinary.js";

const { CloudinaryStorage } = multerStorageCloudinary;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "restaurants",
    allowedFormats: ["jpg", "jpeg", "png"]
  }
});

const upload = multer({ storage });

export default upload;