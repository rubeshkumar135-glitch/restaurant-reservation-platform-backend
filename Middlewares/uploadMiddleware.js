import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profileImages",

    // 🔥 FILE FORMAT CONTROL
    format: async (req, file) => {
      const ext = file.mimetype.split("/")[1]; // jpg/png/jpeg

      if (!["jpg", "jpeg", "png"].includes(ext)) {
        throw new Error("Only JPG, JPEG, PNG allowed");
      }

      return ext; // keep original format
    },

    public_id: (req, file) =>
      Date.now() + "-" + file.originalname,
  },
});

const upload = multer({ storage });

export default upload;