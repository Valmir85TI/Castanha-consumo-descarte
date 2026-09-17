"""
main.py
-------
API principal do Sistema de Consumo — Supermercado Castanha.

Endpoints disponíveis:
    POST /login  — Autentica o utilizador consultando a tabela
                   castanha.usuarios_consumo no PostgreSQL.

A aplicação utiliza FastAPI com CORS habilitado para o frontend
em http://localhost:5173 (Vite dev server).
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
import httpx
import os
from datetime import datetime
from zoneinfo import ZoneInfo

from database import get_connection

BLUESOFT_TOKEN = os.getenv(
    "BLUESOFT_TOKEN",
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJ1c2VyTmFtZVwiOlwidmFsbWlyXCIsXCJzZWNyZXRcIjpcInpjVmNhclJDRFpQYUpldENTZHdXUUpXVE1hVVdmTUlCc1F0enBydXduSlwifSJ9.4M8II2_1RB6zqB4DzHJ5jfPpVVo9iekA-z-w7pp3t6h3BuCdZ7C0yZF1X3OAGrlsxRWTdWC6ghciJFll82H7dQ",
)


def get_bluesoft_headers():
    return {"X-Customtoken": BLUESOFT_TOKEN}

# =============================================================================
# Inicialização da aplicação FastAPI
# =============================================================================
app = FastAPI(
    title="Castanha Consumo API",
    description="API de autenticação para o Sistema de Consumo Interno",
    version="1.0.0",
)

# =============================================================================
# Configuração de CORS — Permite acesso do frontend (Vite dev server)
# =============================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# Modelos Pydantic — Validação de entrada/saída
# =============================================================================
class LoginRequest(BaseModel):
    """
    Modelo de requisição de login.

    Attributes:
        usuario (str): Código do utilizador (até 6 caracteres).
        pswd (str): Senha/PIN do utilizador (até 6 caracteres).
    """
    usuario: str
    pswd: str


class UserResponse(BaseModel):
    """
    Modelo de dados do utilizador retornado após login bem-sucedido.

    Attributes:
        id (int): ID do utilizador na tabela.
        nome (str): Nome completo do utilizador.
    """
    id: int
    nome: str
    tipo: str | None = None


class LoginResponse(BaseModel):
    """
    Modelo de resposta do endpoint de login.

    Attributes:
        success (bool): Indica se o login foi bem-sucedido.
        user (UserResponse | None): Dados do utilizador (somente em caso de sucesso).
        detail (str | None): Mensagem de erro (somente em caso de falha).
    """
    success: bool
    user: UserResponse | None = None
    detail: str | None = None


class ProductResponse(BaseModel):
    """
    Modelo de resposta do endpoint /products/{barcode}.
    """
    descricao: str
    produtoKey: int
    embalagemKey: str
    gtinPrincipal: str
    precoEmVigor: float = 0.0

class ConsumoRequest(BaseModel):
    """
    Modelo de requisição para registrar um consumo.
    """
    codigo_produto: str
    gtin: str | None = None
    produtoKey: int
    codigo_interno: str | None = None
    produto: str
    quantidade: float
    setor: str
    usuario: str
    tipo: str
    
# =============================================================================
# Endpoints
# =============================================================================
@app.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest):
    """
    Autentica o utilizador no sistema.

    Fluxo:
        1. Consulta a tabela castanha.usuarios_consumo pelo campo 'usuario'.
        2. Se o utilizador NÃO existir, retorna mensagem orientando a
           procurar a equipe de TI para cadastro.
        3. Se existir, compara a senha informada com a armazenada no banco.
        4. Se a senha estiver correta, retorna os dados do utilizador.
        5. Se a senha estiver incorreta, retorna mensagem de erro.

    Args:
        credentials (LoginRequest): Dados de login (usuario e pswd).

    Returns:
        LoginResponse: Resultado do login com dados do user ou mensagem de erro.
    """
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Consulta o utilizador pelo campo 'usuario' no esquema castanha
        cursor.execute(
            """
            SELECT id, nome, usuario, pswd, tipo
            FROM castanha.usuarios_consumo
            WHERE usuario = %s
            """,
            (credentials.usuario,)
        )

        row = cursor.fetchone()
        cursor.close()
        conn.close()

        # --- Utilizador não encontrado ---
        if row is None:
            return LoginResponse(
                success=False,
                detail=(
                    "Usuário não cadastrado no sistema. "
                    "Procure a equipe de TI para realizar o seu cadastro."
                ),
            )

        db_id, db_nome, db_usuario, db_pswd, db_tipo = row

        # --- Senha incorreta ---
        if credentials.pswd != db_pswd:
            return LoginResponse(
                success=False,
                detail="Senha incorreta. Verifique e tente novamente.",
            )

        # --- Login bem-sucedido ---
        return LoginResponse(
            success=True,
            user=UserResponse(id=db_id, nome=db_nome, tipo=db_tipo),
        )

    except psycopg2.OperationalError as e:
        # Erro de conexão com o banco (host inacessível, credenciais inválidas, etc.)
        raise HTTPException(
            status_code=503,
            detail=f"Não foi possível conectar ao banco de dados. Erro: {str(e)}",
        )
    except psycopg2.Error as e:
        # Erro genérico do PostgreSQL (query inválida, tabela inexistente, etc.)
        raise HTTPException(
            status_code=500,
            detail=f"Erro interno ao consultar o banco de dados. Erro: {str(e)}",
        )

@app.get("/products/{barcode}", response_model=ProductResponse)
async def get_product(barcode: str):
    """
    Consulta o produto via API da Bluesoft pelo código de barras (GTIN) 
    ou pelo código interno (produtoKey).
    """
    url = "https://erp.bluesoft.com.br/castanha/api/comercial/produtos"
    headers = get_bluesoft_headers()

    async with httpx.AsyncClient() as client:
        try:
            # 1. Tenta buscar por GTIN
            r_gtin = await client.get(url, headers=headers, params={"gtin": barcode}, timeout=10.0)
            if r_gtin.status_code != 200:
                raise HTTPException(status_code=r_gtin.status_code, detail="Erro ao consultar API Bluesoft")
            
            data_list = r_gtin.json().get("data", [])
            
            # 2. Se não encontrou por GTIN, tenta buscar pelo produtoKey
            if not data_list:
                r_key = await client.get(url, headers=headers, params={"produtoKey": barcode}, timeout=10.0)
                if r_key.status_code == 200:
                    data_list = r_key.json().get("data", [])

            # 3. Se ainda não encontrou nada, retorna 404
            if not data_list:
                raise HTTPException(status_code=404, detail="Produto não localizado na Bluesoft.")
                
            produto = data_list[0]
            produtoKey = produto.get("produtoKey", 0)

            # Busca precoEmVigor
            preco_em_vigor = 0.0
            url_preco = "https://erp.bluesoft.com.br/castanha/api/vendas/precos"
            try:
                r_preco = await client.get(url_preco, headers=headers, params={"lojaKey": 1, "produtoKey": produtoKey}, timeout=10.0)
                if r_preco.status_code == 200:
                    data = r_preco.json()
                    data_list_preco = data.get("data", []) if isinstance(data, dict) else data
                    if isinstance(data_list_preco, list) and len(data_list_preco) > 0:
                        preco_em_vigor = float(data_list_preco[0].get("precoEmVigor", 0.0))
            except Exception:
                pass
            
            # Formata a resposta
            return ProductResponse(
                descricao=str(produto.get("descricao") or produto.get("nome") or "Desconhecido"),
                produtoKey=produtoKey,
                embalagemKey=str(produto.get("embalagemKey", "")),
                gtinPrincipal=str(produto.get("gtinPrincipal") or barcode),
                precoEmVigor=preco_em_vigor
            )
            
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Erro de conexão com a API da Bluesoft: {str(e)}")

@app.post("/consumo")
async def registrar_consumo(consumo: ConsumoRequest):
    """
    Registra um novo consumo na tabela castanha.consumo_castanha.
    Busca o preço de venda na Bluesoft antes de gravar.
    """
    url_preco = "https://erp.bluesoft.com.br/castanha/api/vendas/precos"
    headers = get_bluesoft_headers()

    preco_venda = 0.0
    async with httpx.AsyncClient() as client:
        try:
            r = await client.get(
                url_preco, 
                headers=headers, 
                params={"lojaKey": 1, "produtoKey": consumo.produtoKey}, 
                timeout=10.0
            )
            if r.status_code == 200:
                data = r.json()
                # A API pode retornar um array ou um dict contendo 'data'
                data_list = data.get("data", []) if isinstance(data, dict) else data
                if isinstance(data_list, list) and len(data_list) > 0:
                    preco_venda = float(data_list[0].get("precoEmVigor", 0.0))
        except Exception:
            pass # fallback para 0.0 em caso de erro

    try:
        conn = get_connection()
        cursor = conn.cursor()

        agora = datetime.now(ZoneInfo("America/Sao_Paulo"))
        data_atual = agora.date()
        hora_atual = agora.time()
        codigo_interno = str(consumo.produtoKey)

        cursor.execute(
            """
            INSERT INTO castanha.consumo_castanha 
            (codigo_produto, codigo_interno, produto, quantidade, valor, tipo, data, hora, setor, usuario)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                consumo.codigo_produto,
                codigo_interno,
                consumo.produto,
                consumo.quantidade,
                preco_venda,   # Valor buscado na API de preços
                consumo.tipo,
                data_atual,
                hora_atual,
                consumo.setor,
                consumo.usuario
            )
        )
        conn.commit()
        cursor.close()
        conn.close()

        return {"success": True, "message": "Consumo registrado com sucesso."}
    except psycopg2.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao registrar consumo no banco de dados. Erro: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/descarte")
async def registrar_descarte(descarte: ConsumoRequest):
    """
    Registra um novo descarte na tabela castanha.castanha_descarte.
    Busca o preço de venda na Bluesoft antes de gravar, mantendo a mesma
    estrutura de dados usada no lançamento de consumo.
    """
    url_preco = "https://erp.bluesoft.com.br/castanha/api/vendas/precos"
    url_transferencia = "https://erp.bluesoft.com.br/castanha/api/modulos/estoque/operacoes/transferencia-interna"
    headers = get_bluesoft_headers()

    preco_venda = 0.0
    async with httpx.AsyncClient() as client:
        try:
            r = await client.get(
                url_preco,
                headers=headers,
                params={"lojaKey": 1, "produtoKey": descarte.produtoKey},
                timeout=10.0
            )
            if r.status_code == 200:
                data = r.json()
                data_list = data.get("data", []) if isinstance(data, dict) else data
                if isinstance(data_list, list) and len(data_list) > 0:
                    preco_venda = float(data_list[0].get("precoEmVigor", 0.0))
        except Exception:
            pass

    try:
        conn = get_connection()
        cursor = conn.cursor()

        agora = datetime.now(ZoneInfo("America/Sao_Paulo"))
        data_atual = agora.date()
        hora_atual = agora.time()
        perda = round(descarte.quantidade * preco_venda, 2)

        cursor.execute(
            """
            INSERT INTO castanha.castanha_descarte
            (codigo_produto, gtin, produto, quantidade, valor, tipo, data, hora, setor, usuario, perda)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                str(descarte.produtoKey),
                descarte.gtin,
                descarte.produto,
                descarte.quantidade,
                preco_venda,
                descarte.tipo,
                data_atual,
                hora_atual,
                descarte.setor,
                descarte.usuario,
                perda
            )
        )

        transferencia_payload = {
            "lojaKey": 1,
            "estoqueOrigem": "ESTOQUE_VENDA",
            "setorTransferenciaKey": 204925,
            "localDeEstoqueKey": 1,
            "produtos": [
                {
                    "produtoKey": descarte.produtoKey,
                    "quantidade": descarte.quantidade,
                }
            ],
        }

        try:
            async with httpx.AsyncClient() as client:
                transferencia = await client.post(
                    url_transferencia,
                    headers=headers,
                    json=transferencia_payload,
                    timeout=10.0,
                )
        except httpx.RequestError as e:
            conn.rollback()
            cursor.close()
            conn.close()
            raise HTTPException(
                status_code=503,
                detail=f"Erro de conexao ao registrar transferencia interna na Bluesoft: {str(e)}",
            )

        if not 200 <= transferencia.status_code < 300:
            conn.rollback()
            cursor.close()
            conn.close()
            raise HTTPException(
                status_code=502,
                detail=(
                    "Erro ao registrar transferencia interna na Bluesoft. "
                    f"Status: {transferencia.status_code}. Resposta: {transferencia.text}"
                ),
            )

        conn.commit()
        cursor.close()
        conn.close()

        return {"success": True, "message": "Descarte registrado com sucesso."}
    except HTTPException:
        raise
    except psycopg2.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao registrar descarte no banco de dados. Erro: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
