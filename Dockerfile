FROM node:22 AS node

ARG CLIENT_ID=${CLIENT_ID}
ENV CLIENT_ID=${CLIENT_ID}

WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN echo "VITE_CLIENT_ID=$CLIENT_ID" > .env
RUN make build

FROM nginx as server

EXPOSE 80

COPY --from=node /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

