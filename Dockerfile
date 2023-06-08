# FROM rockylinux:9.1.20230215
FROM node:18.16

WORKDIR /bot

# RUN dnf update -y
RUN apt update -y

COPY . .


RUN npm install
RUN npm install play-dl
RUN apt-get install -y ffmpeg
CMD [ "npm", "run", "start" ]