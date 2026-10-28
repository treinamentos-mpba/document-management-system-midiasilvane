import { useRef, useState } from 'react';

export default function UploadComponent({ onUpload, isUploading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedFile || isUploading) {
      return;
    }

    const uploaded = await onUpload(selectedFile);
    if (uploaded) {
      setSelectedFile(null);
      inputRef.current.value = '';
    }
  }

  return (
    <section className="upload-panel" aria-labelledby="upload-title">
      <div className="upload-copy">
        <p className="eyebrow">ADICIONAR À BIBLIOTECA</p>
        <h2 id="upload-title">Envie um documento</h2>
        <p>Selecione um arquivo no seu dispositivo para armazená-lo localmente.</p>
      </div>

      <form className="upload-form" onSubmit={handleSubmit}>
        <label className="file-picker">
          <span className="file-picker-mark" aria-hidden="true">+</span>
          <span className="file-picker-copy">
            <strong>{selectedFile ? 'Trocar arquivo' : 'Escolher arquivo'}</strong>
            <small>{selectedFile ? selectedFile.name : 'Qualquer formato'}</small>
          </span>
          <input
            ref={inputRef}
            type="file"
            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            disabled={isUploading}
          />
        </label>
        <button className="primary-button" type="submit" disabled={!selectedFile || isUploading}>
          {isUploading ? 'Enviando...' : 'Enviar documento'}
        </button>
      </form>
    </section>
  );
}