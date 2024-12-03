FROM node:14.21.2-bullseye-slim

RUN mkdir /myapp
WORKDIR /myapp
COPY package*.json /myapp/
COPY cypress /myapp/cypress
RUN apt-get update && apt-get install -y python build-essential
RUN npm install
COPY . /myapp
RUN chown -R node /myapp/node_modules

EXPOSE 3000
