FROM node:latest

WORKDIR /user/src

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["node", "dist/index.js"]