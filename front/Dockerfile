FROM node:19.1.0-alpine

WORKDIR /front

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "serve"]