FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run prisma:migrate_dev:local

EXPOSE 8080

EXPOSE 5555

CMD ["npm", "run", "start:local"]