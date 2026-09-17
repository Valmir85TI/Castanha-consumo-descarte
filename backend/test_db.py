import sys
import database

print("Tentando conectar...")
try:
    conn = database.get_connection()
    print("Conectado com sucesso!")
    conn.close()
except Exception as e:
    print(f"Erro: {e}")
