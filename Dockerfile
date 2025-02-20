FROM node:18 as base

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY ./src ./src
COPY ./definitions ./definitions
COPY ./tsconfig.json ./

EXPOSE 3001

CMD ["npm", "start"]