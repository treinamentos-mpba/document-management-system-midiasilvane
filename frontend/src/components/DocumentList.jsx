import DownloadButton from './DownloadButton.jsx';

function formatFileSize(size) {
  if (size < 1024) {
    return `${size} B`;
  }

  const units = ['KB', 'MB', 'GB'];
  let value = size / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value)} ${units[unitIndex]}`;
}

function formatUploadDate(value) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function DocumentList({ documents, isLoading, onDownloadError }) {
  if (isLoading && documents.length === 0) {
    return <p className="list-message" role="status">Carregando documentos...</p>;
  }

  if (documents.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-mark" aria-hidden="true">—</span>
        <h3>Nenhum documento por aqui</h3>
        <p>Os arquivos enviados aparecerão nesta lista.</p>
      </div>
    );
  }

  return (
    <ul className="document-list">
      {documents.map((document) => (
        <li className="document-row" key={document.id}>
          <div className="document-main">
            <span className="file-mark" aria-hidden="true">ARQ</span>
            <div className="document-name-group">
              <h3 title={document.originalName}>{document.originalName}</h3>
              <span className="document-size">{formatFileSize(document.size)}</span>
            </div>
          </div>
          <div className="document-actions">
            <time className="document-date" dateTime={document.uploadedAt}>
              {formatUploadDate(document.uploadedAt)}
            </time>
            <DownloadButton document={document} onError={onDownloadError} />
          </div>
        </li>
      ))}
    </ul>
  );
}