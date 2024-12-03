FROM node:10.18.0-buster-slim

RUN mkdir /myapp
WORKDIR /myapp
COPY package*.json /myapp/
RUN apt-get update && apt-get install -y python
RUN npm install
COPY . /myapp
RUN chown -R node /myapp/node_modules

EXPOSE 3000
