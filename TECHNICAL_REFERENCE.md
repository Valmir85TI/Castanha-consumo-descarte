# Referência Técnica - Sistema de Consumo

Este documento fornece detalhes técnicos aprofundados sobre o funcionamento interno, integrações e modelos de dados do Sistema de Consumo.

## 🧠 Fluxo de Operação

### 1. Autenticação (`/login`)
O frontend envia as credenciais (`usuario`, `pswd`). O backend consulta a tabela `castanha.usuarios_consumo`. Se as credenciais coincidirem, retorna um objeto `user` contendo o `id` e o `nome` do operador. O frontend mantém o estado de login apenas em memória (para segurança em terminais compartilhados).

### 2. Consulta de Produto (`/products/{barcode}`)
O sistema realiza uma busca em cascata na API da Bluesoft:
1.  **Por GTIN**: Tenta localizar o produto pelo código de barras escaneado.
2.  **Por produtoKey**: Caso não localize por GTIN, tenta tratar o código como o ID interno da Bluesoft.
3.  **Busca de Preço**: Após localizar o produto, o sistema faz uma segunda chamada à API de preços da Bluesoft (`/vendas/precos`) para obter o `precoEmVigor` na loja 1.

### 3. Lógica de Balança (Frontend)
O sistema detecta automaticamente etiquetas de balança:
- **Padrão**: EAN-13 começando com o dígito `2`.
- **Extração**: 
    - Posições 2 a 5: Código interno do produto.
    - Posições 6 a 12: Valor total da etiqueta (convertido de centavos).
- **Cálculo**: Se o produto for vendido por KG, a quantidade é calculada dividindo o `Valor da Etiqueta` pelo `Preço em Vigor` retornado pela API.

### 4. Registro de Consumo (`/consumo`)
O registro é atômico no banco de dados. Antes de inserir, o backend revalida o preço na Bluesoft para garantir a integridade financeira do registro, independentemente do que o frontend exibiu anteriormente.

---

## 🗄️ Modelagem de Dados (SQL)

### Tabela: `castanha.usuarios_consumo`
Utilizada para gestão de acesso ao terminal.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | SERIAL | Chave primária. |
| `nome` | VARCHAR(100) | Nome completo do operador. |
| `usuario` | VARCHAR(20) | ID de login (ex: número da chapa). |
| `pswd` | VARCHAR(20) | PIN/Senha de acesso. |

### Tabela: `castanha.consumo_castanha`
Repositório central de movimentações.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | SERIAL | Chave primária. |
| `codigo_produto` | VARCHAR(20) | GTIN principal retornado pela API comercial da Bluesoft. |
| `codigo_interno` | VARCHAR(20) | Código interno (`produtoKey`) retornado pela API comercial da Bluesoft. |
| `produto` | VARCHAR(255) | Descrição textual do item. |
| `quantidade` | NUMERIC(10,3) | Volume consumido. |
| `valor` | NUMERIC(10,2) | Preço de venda unitário no momento. |
| `tipo` | VARCHAR(20) | Natureza da operação (Padrão: "CONSUMO"). |
| `data` | DATE | Data do registro. |
| `hora` | TIME | Hora do registro. |
| `setor` | VARCHAR(50) | Setor solicitante (ex: PADARIA). |
| `usuario` | VARCHAR(100) | Nome do operador que realizou o registro. |

---

## 🔌 Integração Bluesoft (Endpoints)

| Função | Método | URL |
| :--- | :--- | :--- |
| Lista de Produtos | `GET` | `.../api/comercial/produtos` |
| Tabela de Preços | `GET` | `.../api/vendas/precos` |

**Cabeçalho de Autenticação**:
O sistema utiliza o cabeçalho `X-Customtoken` para todas as requisições à API da Bluesoft.

---

## 🛡️ Tratamento de Erros e Resiliência
- **Backend**: Implementa blocos `try-except` com captura específica de `psycopg2.OperationalError` para falhas de rede com o DB e `httpx.RequestError` para indisponibilidade da API externa.
- **Frontend**: Utiliza alertas visuais (Toast/Alerts) para informar o usuário sobre falhas de conexão ou produtos não encontrados, mantendo o foco no campo de busca para permitir nova tentativa rápida.
