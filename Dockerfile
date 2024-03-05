FROM node:latest AS builder

WORKDIR /user/src

COPY package*.json ./

RUN npm install 

COPY . . 

RUN npm run build


#step 2
FROM node:14-alpine

WORKDIR /user/src

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /user/src/dist ./dist

ENV CONNECTION_STRING="mongodb://admin:admin@mongo:27017?authSource=admin"

EXPOSE 8000

CMD ["node", "dist/index.js"]