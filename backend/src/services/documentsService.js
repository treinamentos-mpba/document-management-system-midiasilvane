function createDocumentsService({ documentsRepository }) {
  return {
    uploadDocument({ originalName, size, storageKey }) {
      const document = {
        id: storageKey,
        originalName,
        size,
        uploadedAt: new Date().toISOString(),
        owner: 'local-user',
      };

      return documentsRepository.save(document, storageKey);
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