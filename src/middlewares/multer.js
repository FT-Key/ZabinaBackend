import multer from "multer";

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes"), false);
  }
};

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: imageFilter
});

export default upload;