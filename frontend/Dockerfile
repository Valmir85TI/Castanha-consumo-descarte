# Etapa 1: Build do Frontend usando Node
FROM node:22-alpine as builder

WORKDIR /app

# Copia e instala dependências para otimizar o cache
COPY package*.json ./
RUN npm install

# Copia o código da aplicação
COPY . .

# Recebe a variável de ambiente definida no docker-compose para o build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Gera os arquivos estáticos (HTML/CSS/JS) compactados
RUN npm run build

# Etapa 2: Servidor Web (Nginx) para disponibilizar o site
FROM nginx:alpine

# Copia os arquivos gerados pela etapa 1 (build) para a pasta pública do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia a configuração do Nginx que previne erros 404 em rotas do React
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 do Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
