FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/.output .
ENV HOST=0.0.0.0 PORT=3000
EXPOSE 3000
CMD ["node", "./server/index.mjs"]