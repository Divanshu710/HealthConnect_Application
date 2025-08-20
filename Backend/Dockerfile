FROM node:22

WORKDIR /app

COPY package.json /app

RUN npm install
RUN npm rebuild bcrypt --build-from-source

COPY . /app

EXPOSE 5000


CMD ["node", "src/index.js"]