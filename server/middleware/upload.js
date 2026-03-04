// Upload Middleware - handles file uploads using multer
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the upload directory exists relative to the server root
const uploadDir = path.join(__dirname, '../uploads'); //
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); //
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Points to the 'uploads' folder in your server directory
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname)); //
  }
});

// Accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max per file
});

module.exports = upload; //