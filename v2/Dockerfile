FROM node:8
WORKDIR /usr/src/app
COPY package-lock.json .
COPY package.json .
RUN npm install
COPY . .
EXPOSE 60001
ENV PORT=60001
CMD [ "npm", "start" ]
