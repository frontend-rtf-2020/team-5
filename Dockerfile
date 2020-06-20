FROM node:7.10 as build-deps
WORKDIR /usr/src/app
COPY ./client .
RUN pwd && npm install && npm run-script build


FROM nginx:latest
COPY --from=build-deps /usr/src/app/build /var/www/

RUN chmod -R a+x /var/www
COPY nginx.conf /etc/nginx/nginx.conf