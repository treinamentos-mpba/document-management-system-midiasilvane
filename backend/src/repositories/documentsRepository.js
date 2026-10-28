const path = require('node:path');

function createDocumentsRepository({ storageDirectory }) {
  const documents = new Map();

  return {
    save(document, storedFileName) {
      documents.set(document.id, { ...document, storedFileName });
      return { ...document };
    },

    list() {
      return Array.from(documents.values(), ({ storedFileName, ...document }) => ({
        ...document,
      }));
    },

    findById(id) {
      const storedDocument = documents.get(id);
      if (!storedDocument) {
        return null;
      }

      const { storedFileName, ...document } = storedDocument;
      return {
        document: { ...document },
        filePath: path.join(storageDirectory, storedFileName),
      };
    },
  };
}

module.exports = createDocumentsRepository;