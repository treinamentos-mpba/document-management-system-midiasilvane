const API_PREFIX = '/api';

async function ensureSuccess(response) {
  if (response.ok) {
    return response;
  }

  const payload = await response.json().catch(() => null);
  throw new Error(payload?.error || 'Não foi possível concluir a solicitação.');
}

export async function listDocuments() {
  const response = await ensureSuccess(await fetch(`${API_PREFIX}/documents`));
  return response.json();
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await ensureSuccess(await fetch(`${API_PREFIX}/upload`, {
    method: 'POST',
    body: formData,
  }));
  return response.json();
}

export async function downloadDocument(id) {
  const response = await ensureSuccess(
    await fetch(`${API_PREFIX}/documents/${encodeURIComponent(id)}/download`)
  );
  return response.blob();
}