FROM node:18.16

WORKDIR /bot

# RUN dnf update -y
RUN apt update -y

COPY package.json .
RUN npm install
RUN npm install play-dl
RUN apt-get install -y ffmpeg

COPY . .

CMD [ "npm", "run", "start" ]