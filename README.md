# 🌰 Sistema de Consumo - Supermercado Castanha

O **Sistema de Consumo** é uma aplicação interna desenvolvida para o **Supermercado Castanha**, projetada para otimizar o registro de produtos consumidos nos diversos setores da loja (Rotisserie, Padaria, Frios, etc.). A aplicação integra-se diretamente com o ERP **Bluesoft** para consulta de produtos e utiliza um banco de dados **PostgreSQL** para persistência dos registros de consumo e autenticação de usuários.

---

## 🚀 Arquitetura e Tecnologias

O sistema utiliza uma arquitetura moderna e desacoplada:

- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python) - API RESTful de alta performance.
- **Frontend**: [React](https://reactjs.org/) com [Vite](https://vitejs.dev/) e [TailwindCSS](https://tailwindcss.com/) - Interface responsiva, rápida e intuitiva.
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/) - Armazenamento seguro de dados.
- **Containerização**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) - Padronização do ambiente de execução e facilidade de deploy.
- **Integração ERP**: [Bluesoft Cosmos API](https://cosmos.bluesoft.com.br/api) - Consulta em tempo real de informações de produtos e preços.

---

## ✨ Funcionalidades Principais

1.  **Autenticação de Operadores**: Acesso restrito via Login/ID e PIN, validado contra a base de dados interna.
2.  **Consulta de Produtos**: Suporte a leitura de códigos de barras (EAN/GTIN) e códigos internos da Bluesoft.
3.  **Processamento de Balança**: Inteligência integrada para decodificar etiquetas de balança (EAN-13 iniciando com '2'), extraindo automaticamente o código do produto e calculando a quantidade baseada no preço/valor da etiqueta.
4.  **Seleção de Setores**: Atribuição rápida do consumo a um setor específico (ROTISSERIE, PADARIA, etc.).
5.  **Registro Histórico**: Gravação detalhada de cada movimentação, incluindo data, hora, usuário, produto, quantidade e valor de venda em vigor.

---

## 🛠️ Configuração do Ambiente

### Pré-requisitos
- Docker e Docker Compose instalados.
- Acesso à rede interna (para comunicação com o banco PostgreSQL no IP `192.168.0.50`).

### Variáveis de Ambiente (.env)
No diretório `backend/`, crie ou edite o arquivo `.env` com as seguintes definições:

```env
DB_HOST=192.168.0.50
DB_PORT=5432
DB_USER=metabase_ti
DB_PASSWORD=SUA_SENHA_AQUI
DB_NAME=metabase
```

---

## 🐳 Execução via Docker (Recomendado)

Para subir todo o ecossistema (Backend + Frontend):

1.  No diretório raiz, execute:
    ```bash
    docker-compose up -d --build
    ```
2.  **Nota sobre o Frontend**: No `docker-compose.yml`, certifique-se de configurar o argumento `VITE_API_URL` com o IP do servidor onde o backend estará rodando.

O sistema ficará disponível em:
- **Frontend**: `http://IP_DO_SERVIDOR:82`
- **Backend API**: `http://IP_DO_SERVIDOR:8000/docs` (Swagger UI)

---

## 💻 Desenvolvimento Local

### Backend (Python)
1.  Acesse `cd backend`.
2.  Crie um ambiente virtual: `python -m venv .venv`.
3.  Instale as dependências: `pip install -r requirements.txt`.
4.  Execute: `uvicorn main:app --reload`.

### Frontend (Node.js)
1.  Acesse `cd frontend`.
2.  Instale as dependências: `npm install`.
3.  Inicie o servidor de desenvolvimento: `npm run dev`.

---

## 📊 Estrutura de Dados (PostgreSQL)

O sistema opera no esquema `castanha`:

- **`castanha.usuarios_consumo`**: Armazena credenciais de acesso.
- **`castanha.consumo_castanha`**: Registra as transações de consumo.

---

## ⚖️ Licença e Autoria

Este software é de propriedade exclusiva do **Supermercado Castanha**.
Desenvolvido e Mantido pelo **Departamento de TI**.

---
*Documentação gerada em Maio de 2026.*
