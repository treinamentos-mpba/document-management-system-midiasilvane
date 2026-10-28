const { randomUUID } = require('node:crypto');
const fs = require('node:fs');
const express = require('express');
const multer = require('multer');

function createDocumentsRouter({ documentsController, storageDirectory }) {
  fs.mkdirSync(storageDirectory, { recursive: true });

  const storage = multer.diskStorage({
    destination: storageDirectory,
    filename: (req, file, callback) => callback(null, randomUUID()),
  });
  const upload = multer({ storage });
  const router = express.Router();

  router.post('/upload', upload.single('file'), documentsController.upload);
  router.get('/documents', documentsController.list);
  router.get('/documents/:id/download', documentsController.download);

  return router;
}

module.exports = createDocumentsRouter;