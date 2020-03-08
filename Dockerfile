FROM node:12-alpine

WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV NODE_ENV production
CMD ["npm", "start"]
