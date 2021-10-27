FROM node:14-alpine

WORKDIR /usr/src/app

COPY . .

ENV NODE_ENV production

RUN npm install

CMD ["npm", "start"]
