"""
database.py
-----------
Módulo responsável pela conexão com o banco de dados PostgreSQL.
Utiliza psycopg2 para estabelecer conexões síncronas com o banco
e carrega as credenciais a partir do arquivo .env.

Banco: metabase | Esquema: castanha | Tabela: usuarios_consumo
"""

import os
import psycopg2
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# Configuração de conexão extraída das variáveis de ambiente
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "192.168.0.50"),
    "port": int(os.getenv("DB_PORT", "5432")),
    "user": os.getenv("DB_USER", "metabase_ti"),
    "password": os.getenv("DB_PASSWORD"),
    "dbname": os.getenv("DB_NAME", "metabase"),
}


def get_connection():
    """
    Estabelece e retorna uma conexão com o banco de dados PostgreSQL.

    Returns:
        psycopg2.connection: Objeto de conexão ativa com o banco.

    Raises:
        psycopg2.OperationalError: Se não for possível conectar ao banco
        (ex.: host inacessível, credenciais inválidas, banco inexistente).
    """
    return psycopg2.connect(**DB_CONFIG)
