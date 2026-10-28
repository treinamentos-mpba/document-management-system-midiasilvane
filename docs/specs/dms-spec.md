# Especificação - Document Management System

## 1. Objetivo

Permitir o envio, a listagem e o download de documentos por meio de uma interface web, armazenando os arquivos no filesystem local da aplicação.

## 2. Escopo

### Dentro do escopo

- Upload de documentos.
- Listagem dos metadados dos documentos enviados.
- Download de um documento por identificador.
- Metadados com identificador, nome original, tamanho, data de envio e dono.
- Interface React integrada à API do backend.

### Fora do escopo

- Armazenamento em nuvem ou em serviços externos.
- Versionamento de documentos.
- Persistência dos metadados em banco de dados.
- Autenticação e isolamento de documentos por usuário nesta fase.

## 3. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF-01 | O usuário pode enviar um arquivo e recebe os metadados do documento criado. |
| RF-02 | O usuário pode listar os metadados dos documentos disponíveis. |
| RF-03 | O usuário pode baixar um documento pelo identificador. |
| RF-04 | A API rejeita uploads sem arquivo e retorna uma mensagem de erro clara. |
| RF-05 | Cada documento possui um campo `owner`; como não há autenticação nesta fase, o campo usa o identificador padrão `local-user`. |

## 4. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF-01 | Os arquivos são gravados em `backend/storage` com Multer e `diskStorage`. |
| RNF-02 | Os metadados são mantidos em memória e se perdem quando o backend reinicia. |
| RNF-03 | A configuração operacional, como a porta do servidor, utiliza variáveis de ambiente quando aplicável. |
| RNF-04 | O backend segue as camadas routes, controllers, services e repositories. |
| RNF-05 | O frontend usa React e acessa o backend por `fetch` através do prefixo `/api` do proxy Vite. |
| RNF-06 | Os testes do backend usam o runner nativo `node:test`. |

## 5. Modelo de dados (metadados do documento)

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | string | Identificador único gerado pelo servidor. |
| `originalName` | string | Nome original do arquivo enviado. |
| `size` | number | Tamanho do arquivo em bytes. |
| `uploadedAt` | string | Data e hora do upload em formato ISO 8601. |
| `owner` | string | Identificador do dono; nesta fase, `local-user`. |

## 6. Contratos de API

O backend expõe as rotas abaixo. O prefixo `/api` é aplicado pelo proxy do frontend e não precisa fazer parte das rotas Express.

### `POST /upload`

- Entrada: `multipart/form-data` com o arquivo no campo `file`.
- Sucesso: `201 Created` com os metadados do documento criado.
- Erro: `400 Bad Request` quando nenhum arquivo é enviado.
- Erro: `500 Internal Server Error` quando ocorre uma falha inesperada ao salvar o arquivo.

### `GET /documents`

- Sucesso: `200 OK` com uma lista de metadados.
- A lista contém todos os documentos, pois esta fase não implementa autenticação nem isolamento por usuário.

### `GET /documents/:id/download`

- Sucesso: conteúdo binário do arquivo como anexo, com o nome original.
- Erro: `404 Not Found` quando o identificador não corresponde a um documento disponível.

## 7. Decisões arquiteturais

- O fluxo de dependência do backend é routes → controllers → services → repositories.
- Multer recebe os arquivos e grava-os somente no filesystem local da aplicação.
- O repository mantém os metadados em memória.
- O identificador do documento localiza o arquivo; o cliente não fornece caminhos do filesystem.
- O campo `owner` recebe `local-user` enquanto não houver autenticação no escopo.
- O frontend organiza a interface em componentes reutilizáveis e concentra chamadas HTTP em um serviço.

## 8. Plano de execução

1. Implementar upload, listagem e download no backend, com armazenamento local, metadados em memória e testes.
2. Criar os componentes e o serviço de API no frontend para upload, listagem e download.
3. Integrar frontend e backend pelo proxy Vite e validar manualmente o fluxo completo.
4. Explorar os agentes e prompts customizados do exercício, criar as customizações exigidas e validar os passos.
5. Abrir um Pull Request de `feature/dms` para `main` para integrar os Passos 1 a 4.