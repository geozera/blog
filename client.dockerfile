ARG NODE_VERSION=22.14.0-alpine
ARG NGINX_VERSION=alpine3.21

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY ./client/package*.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY ./client .

RUN npm run build 

FROM nginx:alpine AS runner

COPY --from=builder /app/dist/blog/browser/* /usr/share/nginx/html/
COPY ./client/nginx.conf /etc/nginx/nginx.conf

# Remove the default nginx config to prevent conflicts
RUN rm -f /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]