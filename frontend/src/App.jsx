import { useEffect, useState } from 'react';
import DocumentList from './components/DocumentList.jsx';
import UploadComponent from './components/UploadComponent.jsx';
import { listDocuments, uploadDocument } from './services/documentsService.js';
import './App.css';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function refreshDocuments() {
    setIsLoading(true);
    setError('');

    try {
      const result = await listDocuments();
      setDocuments(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isActive = true;

    listDocuments()
      .then((result) => {
        if (isActive) {
          setDocuments(result);
        }
      })
      .catch((requestError) => {
        if (isActive) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  async function handleUpload(file) {
    setIsUploading(true);
    setError('');
    setNotice('');

    try {
      const document = await uploadDocument(file);
      setDocuments((currentDocuments) => [document, ...currentDocuments]);
      setNotice('Documento enviado com sucesso.');
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand" aria-label="DMS Documentos">
            <span className="brand-mark" aria-hidden="true">D</span>
            <span className="brand-name">Documentos</span>
          </div>
          <div className="storage-status">
            <span className="status-dot" aria-hidden="true" />
            <span>Armazenamento local</span>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="page-heading" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">ESPAÇO DE TRABALHO</p>
            <h1 id="page-title">Seus documentos</h1>
            <p className="page-description">
              Envie arquivos, consulte sua biblioteca e baixe o que precisar.
            </p>
          </div>
          <div className="document-count" aria-live="polite">
            <span className="count-number">{documents.length}</span>
            <span>{documents.length === 1 ? 'documento' : 'documentos'}</span>
          </div>
        </section>

        <UploadComponent onUpload={handleUpload} isUploading={isUploading} />

        {error && (
          <div className="feedback feedback-error" role="alert">
            <span>{error}</span>
            {!documents.length && !isLoading && (
              <button className="text-button" type="button" onClick={refreshDocuments}>
                Tentar novamente
              </button>
            )}
          </div>
        )}
        {notice && (
          <div className="feedback feedback-success" role="status">
            {notice}
          </div>
        )}

        <section className="documents-section" aria-labelledby="documents-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">BIBLIOTECA</p>
              <h2 id="documents-title">Todos os documentos</h2>
            </div>
            <button
              className="secondary-button"
              type="button"
              onClick={refreshDocuments}
              disabled={isLoading}
            >
              {isLoading ? 'Atualizando...' : 'Atualizar lista'}
            </button>
          </div>

          <DocumentList
            documents={documents}
            isLoading={isLoading}
            onDownloadError={(message) => setError(message)}
          />
        </section>
      </main>
      <footer className="footer">
        <span>DMS</span>
        <span>Seus arquivos permanecem no armazenamento local da aplicação.</span>
      </footer>
    </div>
  );
}
