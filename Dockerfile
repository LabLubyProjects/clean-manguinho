FROM node:16.17.0-alpine
WORKDIR /usr/src/clean-node-api
COPY package.json .
COPY yarn.lock .
RUN yarn install --production --frozen-lockfile
