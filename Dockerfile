FROM node:12-alpine

WORKDIR /usr/src/app

COPY . .

ENV NODE_ENV production

RUN npm install

CMD ["npm", "start"]
