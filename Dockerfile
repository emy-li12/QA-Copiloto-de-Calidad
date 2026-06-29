FROM node:22-bookworm

WORKDIR /app

# Instalar dependencias primero (capa cacheable)
COPY package*.json ./
RUN npm ci

# Instalar todos los browsers + sus dependencias del sistema
RUN npx playwright install --with-deps

# Copiar el resto del proyecto
COPY . .

CMD ["npx", "playwright", "test"]
