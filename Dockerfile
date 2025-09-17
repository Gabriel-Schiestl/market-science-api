FROM node:20-alpine AS build-stage 

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

FROM node:20-alpine AS production-stage

WORKDIR /usr/local/app

COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main"]