FROM node:latest

WORKDIR /user/src

COPY package*.json ./

RUN npm install 

ENV CONNECTION_STRING="mongodb://admin:admin@mongo:27017?authSource=admin"

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["node", "dist/index.js"]