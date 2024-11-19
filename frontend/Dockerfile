FROM node:23-alpine

WORKDIR /app/frontend

RUN npm config set strict-ssl false

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
