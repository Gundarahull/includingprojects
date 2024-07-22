const express = require("express");
const {
  downloadData,
  productDownload,
  uploadData,
} = require("../controllers/uploadDownloadController");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/download", downloadData);
router.post("/productDownload", productDownload);
router.post("/upload",upload.single("file"), uploadData);

module.exports = router;
