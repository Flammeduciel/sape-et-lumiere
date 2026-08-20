const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'assets', 'images', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E6);
    cb(null, `${name}_${unique}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|svg/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images (jpg, png, gif, webp, svg) sont acceptées'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

function uploadRoutes(db) {
  const router = express.Router();

  router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier envoyé' });
    }
    const relativePath = `assets/images/uploads/${req.file.filename}`;
    res.json({
      path: relativePath,
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size
    });
  });

  router.delete('/:filename', (req, res) => {
    const filepath = path.join(UPLOAD_DIR, req.params.filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ message: 'Image supprimée' });
    } else {
      res.status(404).json({ error: 'Image non trouvée' });
    }
  });

  return router;
}

module.exports = uploadRoutes;
