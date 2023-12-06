ARG NODE_VERSION=21.2.0

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]