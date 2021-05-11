FROM node:alpine

WORKDIR /usr/src/app/server

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY ./ ./

CMD [ "npm", "start" ]