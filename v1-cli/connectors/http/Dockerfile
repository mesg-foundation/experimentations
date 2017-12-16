FROM node
WORKDIR /usr/src/app
COPY package-lock.json .
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]
