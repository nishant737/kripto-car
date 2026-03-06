import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directories if they don't exist
const servicesDir = path.join(__dirname, '..', 'uploads', 'services');
const carsDir = path.join(__dirname, '..', 'uploads', 'cars');

if (!fs.existsSync(servicesDir)) {
  fs.mkdirSync(servicesDir, { recursive: true });
}

if (!fs.existsSync(carsDir)) {
  fs.mkdirSync(carsDir, { recursive: true });
}

// Configure storage for services
const serviceStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, servicesDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: dealerId-timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const dealerId = req.dealer._id;
    cb(null, `dealer-${dealerId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Configure storage for car images
const carStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, carsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: car-dealerId-timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const dealerId = req.dealer._id;
    cb(null, `car-${dealerId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Configure multer for services
const upload = multer({
  storage: serviceStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  },
  fileFilter: fileFilter
});

// Configure multer for car images (supports multiple images)
const carUpload = multer({
  storage: carStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  },
  fileFilter: fileFilter
});

// Export service upload middleware
export default upload;

// Export car images upload middleware (supports up to 10 images)
export const uploadCarImages = carUpload.array('images', 10);
