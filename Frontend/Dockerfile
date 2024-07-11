FROM node:latest AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build 


#

FROM nginx:alpine as production

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

COPY container-env.sh /container-env.sh

RUN chmod +x /container-env.sh

ENTRYPOINT ["/container-env.sh"]

