FROM node:10 AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g pm2
RUN npm run build

FROM node:10-alpine

WORKDIR /app
COPY --from=builder /app ./
CMD ["pm2-runtime", "npm", "run", "start:prod"]
# CMD ["npm", "run", "start:prod"]