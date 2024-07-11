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

ENV VITE_API_LINK=VITE_API_LINK_PLACEHOLDER

COPY container-env.sh /container-env.sh

RUN chmod u+x /container-env.sh

ENTRYPOINT ["/container-env.sh"]

CMD ["nginx", "-g", "daemon off;"]

