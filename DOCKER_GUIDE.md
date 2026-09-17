# Guia de Deploy com Docker

Este guia detalha o processo de build e implantação do Sistema de Consumo utilizando Docker.

## 🏗️ Estrutura do Docker Compose

O arquivo `docker-compose.yml` na raiz gerencia dois serviços principais:
1.  **backend**: API FastAPI (Porta 8000).
2.  **frontend**: App React servido via Nginx (Porta 82).

## 🚀 Passo a Passo para Deploy

### 1. Preparação do Backend
Certifique-se de que o arquivo `backend/.env` existe e contém as credenciais corretas do banco de dados PostgreSQL. O Docker irá injetar essas variáveis automaticamente.

### 2. Configuração do IP do Servidor (Crítico)
Como o frontend é buildado estaticamente, a URL do backend deve ser injetada no momento do build. 

No arquivo `docker-compose.yml`, localize a seção `args` do serviço `frontend` e altere para o IP real do servidor onde os containers estarão rodando:

```yaml
frontend:
  build: 
    context: ./frontend
    args:
      - VITE_API_URL=http://192.168.0.41:8000  # <--- Altere para o IP do seu Servidor
```

### 3. Build e Execução
Execute o comando abaixo para construir as imagens e iniciar os containers em modo "detached" (segundo plano):

```bash
docker-compose up -d --build
```

## 🔍 Comandos Úteis de Diagnóstico

**Verificar se os containers estão rodando:**
```bash
docker ps
```

**Visualizar logs do Backend em tempo real:**
```bash
docker logs -f castanha_backend
```

**Visualizar logs do Frontend (Nginx):**
```bash
docker logs -f castanha_frontend
```

**Reiniciar apenas um serviço:**
```bash
docker-compose restart backend
```

## ⚠️ Observações Importantes
- **Rede**: Os containers precisam de acesso à rede externa para consultar a API da Bluesoft e acesso à rede interna para o banco de dados no IP `192.168.0.50`.
- **CORS**: O backend está configurado para permitir origens `*`, mas em produção, recomenda-se restringir ao IP/Porta específico do frontend.
- **Persistência**: O banco de dados PostgreSQL é externo e não é gerenciado por este Docker Compose.
