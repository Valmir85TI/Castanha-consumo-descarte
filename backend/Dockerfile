FROM python:3.11-slim

WORKDIR /app

# Instalar dependências essenciais de sistema para o PostgreSQL (psycopg2)
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Copiar apenas os requisitos primeiro, para usar o cache do Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Agora copia todo o restante do código
COPY . .

# Expõe a porta do FastAPI
EXPOSE 8000

# Executa o servidor na porta 8000 acessível externamente
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
