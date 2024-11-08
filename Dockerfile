FROM node:lts-alpine AS base

RUN mkdir -p /app && chown node:node /app
WORKDIR /app
USER node

FROM base AS dependencies
COPY --chown=node:node . .
COPY --chown=node:node package.json ./

RUN npm install

# Aliases for dependencies
FROM dependencies AS development
