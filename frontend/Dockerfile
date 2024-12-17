FROM node:alpine as build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build


FROM nginx:latest as prod

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000/tcp

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]