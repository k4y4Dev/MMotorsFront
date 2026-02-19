FROM node:24.12.0-alpine3.23 AS build

WORKDIR /app

RUN npm install -g @angular/cli

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build

FROM nginx:1.29.4-alpine3.23

# If personal config needed (optional)
#COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/motorsFront/browser /usr/share/nginx/html

EXPOSE 80

