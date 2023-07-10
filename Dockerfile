FROM node:18-alpine as dependencies

WORKDIR /app

COPY package.json .

RUN yarn
COPY . .

# Build production image
FROM dependencies as builder
RUN yarn build
EXPOSE 8080

CMD yarn start