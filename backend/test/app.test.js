const { test } = require('node:test');
const assert = require('node:assert');
const { mkdtemp, rm } = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const app = require('../src/app');
const createApp = app.buildApp;

test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

async function startServer(t, testApp) {
  const server = testApp.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  return `http://127.0.0.1:${server.address().port}`;
}

async function createTestApp(t) {
  const storageDirectory = await mkdtemp(path.join(os.tmpdir(), 'dms-test-'));
  t.after(() => rm(storageDirectory, { recursive: true, force: true }));
  return createApp({ storageDirectory });
}

test('envia, lista e baixa um documento', async (t) => {
  const baseUrl = await startServer(t, await createTestApp(t));
  const formData = new FormData();
  formData.append('file', new Blob(['conteudo de teste']), 'relatorio.txt');

  const uploadResponse = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: formData,
  });

  assert.strictEqual(uploadResponse.status, 201);
  const document = await uploadResponse.json();
  assert.strictEqual(document.originalName, 'relatorio.txt');
  assert.strictEqual(document.size, 17);
  assert.strictEqual(document.owner, 'local-user');
  assert.ok(document.id);
  assert.ok(!Number.isNaN(Date.parse(document.uploadedAt)));

  const listResponse = await fetch(`${baseUrl}/documents`);
  assert.strictEqual(listResponse.status, 200);
  assert.deepStrictEqual(await listResponse.json(), [document]);

  const downloadResponse = await fetch(`${baseUrl}/documents/${document.id}/download`);
  assert.strictEqual(downloadResponse.status, 200);
  assert.strictEqual(await downloadResponse.text(), 'conteudo de teste');
  assert.match(downloadResponse.headers.get('content-disposition'), /relatorio\.txt/);
});

test('rejeita upload sem arquivo', async (t) => {
  const baseUrl = await startServer(t, await createTestApp(t));
  const response = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: new FormData(),
  });

  assert.strictEqual(response.status, 400);
  assert.ok((await response.json()).error);
});

test('retorna 404 ao baixar um documento inexistente', async (t) => {
  const baseUrl = await startServer(t, await createTestApp(t));
  const response = await fetch(`${baseUrl}/documents/inexistente/download`);

  assert.strictEqual(response.status, 404);
  assert.ok((await response.json()).error);
});
