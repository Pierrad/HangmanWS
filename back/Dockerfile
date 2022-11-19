FROM node:19.1.0-alpine

WORKDIR /back

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]