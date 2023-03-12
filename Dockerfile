FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm pnpm nodemon && pnpm install
COPY . .
EXPOSE 8081
CMD [ "pnpm", "start"]