import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Initialize multer with the storage configuration
export const upload = multer({ storage });

upload.any((req, res, next) => {
  console.log(
    "Fields processed:",
    req.files.map((file) => file.fieldname)
  );
  next();
});
