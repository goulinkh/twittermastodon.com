FROM node:18

WORKDIR /srv

COPY package.json yarn.lock ./
RUN yarn install
COPY . .

EXPOSE 8080

CMD [ "yarn", "start" ]
