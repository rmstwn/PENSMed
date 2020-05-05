FROM node:12-alpine

WORKDIR /home/

COPY package.json .
RUN apk --no-cache --virtual build-dependencies add \
    python make g++ \
    && apk update \
    && npm i \
    && apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime \
    && echo "Asia/Jakarta" >  /etc/timezone \
    && apk del tzdata build-dependencies make g++

ENV NODE_ENV production

COPY . .

CMD ["npm","start"]