---
description: Revisa e valida um endpoint do backend antes do commit.
name: validar-endpoint
argument-hint: método e rota (ex. POST /upload)
agent: agent
---

# Validar endpoint do backend

Revise o endpoint `${input:endpoint:método e rota}` antes do commit.

Verifique o fluxo completo em `backend/src`: rota, controller, service e repository. Confirme que o contrato HTTP, a validação de entrada e os erros retornados são coerentes entre as camadas.

Se o endpoint usar arquivos, confirme que o armazenamento permanece no filesystem local com Multer e `diskStorage`, e que os metadados seguem a estratégia atual do projeto.

Confira se há testes para os principais casos de sucesso e erro. Adicione somente testes focados quando houver lacunas e execute `cd backend && npm test`.

Não altere arquivos fora do escopo do endpoint, não introduza dependências sem necessidade e preserve todas as mudanças locais preexistentes. Ao final, resuma os arquivos revisados, os testes executados e qualquer problema encontrado.