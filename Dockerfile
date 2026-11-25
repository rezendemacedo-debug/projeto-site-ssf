FROM node:24-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/

FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production HOSTNAME=0.0.0.0 DATABASE_URL=file:/data/ssf.db
# A imagem mantém as dependências para rodar a migração na subida.
COPY --from=build /app ./
RUN mkdir /data && chown node /data
USER node
VOLUME /data
EXPOSE 3000
CMD ["sh", "-c", "npm run db:migrate && node .next/standalone/server.js"]
