FROM node:10.16.0
RUN npm install gulp -g -y

RUN mkdir /myapp
WORKDIR /myapp
COPY package*.json /myapp/
RUN npm install
COPY . /myapp

EXPOSE 3000