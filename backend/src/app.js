const path = require('node:path');
const express = require('express');
const multer = require('multer');
const createDocumentsRepository = require('./repositories/documentsRepository');
const createDocumentsService = require('./services/documentsService');
const createDocumentsController = require('./controllers/documentsController');
const createDocumentsRouter = require('./routes/documentsRoutes');

const PORT = process.env.PORT || 3000;

function buildApp({ storageDirectory } = {}) {
  const resolvedStorageDirectory = path.resolve(
    storageDirectory || process.env.DOCUMENT_STORAGE_PATH || path.join(__dirname, '..', 'storage')
  );
  const documentsRepository = createDocumentsRepository({
    storageDirectory: resolvedStorageDirectory,
  });
  const documentsService = createDocumentsService({ documentsRepository });
  const documentsController = createDocumentsController({ documentsService });
  const documentsRouter = createDocumentsRouter({
    documentsController,
    storageDirectory: resolvedStorageDirectory,
  });
  const app = express();

  app.use(express.json());
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  app.use(documentsRouter);
  app.use((error, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }

    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: 'Não foi possível processar o arquivo enviado.' });
    }

    return res.status(500).json({ error: 'Erro interno do servidor.' });
  });

  return app;
}

const app = buildApp();
app.buildApp = buildApp;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DMS backend ouvindo na porta ${PORT}`);
  });
}

module.exports = app;
