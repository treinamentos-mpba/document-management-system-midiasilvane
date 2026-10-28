function createDocumentsController({ documentsService }) {
  return {
    async upload(req, res, next) {
      try {
        if (!req.file) {
          return res.status(400).json({ error: 'Envie um arquivo no campo "file".' });
        }

        const document = await documentsService.uploadDocument({
          originalName: req.file.originalname,
          size: req.file.size,
          storageKey: req.file.filename,
        });
        return res.status(201).json(document);
      } catch (error) {
        return next(error);
      }
    },

    async list(req, res, next) {
      try {
        const documents = await documentsService.listDocuments();
        return res.status(200).json(documents);
      } catch (error) {
        return next(error);
      }
    },

    async download(req, res, next) {
      try {
        const result = await documentsService.getDocumentForDownload(req.params.id);
        if (!result) {
          return res.status(404).json({ error: 'Documento não encontrado.' });
        }

        return res.download(result.filePath, result.document.originalName, (error) => {
          if (!error) {
            return;
          }

          if (res.headersSent) {
            return next(error);
          }

          if (error.code === 'ENOENT') {
            return res.status(404).json({ error: 'Documento não encontrado.' });
          }

          return next(error);
        });
      } catch (error) {
        return next(error);
      }
    },
  };
}

module.exports = createDocumentsController;