const { randomUUID } = require('node:crypto');

function createDocumentsService({ documentsRepository }) {
  return {
    uploadDocument(file) {
      const document = {
        id: randomUUID(),
        originalName: file.originalname,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        owner: 'local-user',
      };

      return documentsRepository.save(document, file.filename);
    },

    listDocuments() {
      return documentsRepository.list();
    },

    getDocumentForDownload(id) {
      return documentsRepository.findById(id);
    },
  };
}

module.exports = createDocumentsService;