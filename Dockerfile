# pull official base image
FROM node:16.6.1

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
# ADD /client/package.json /app/client
# ADD /server/package.json /app/server

RUN mkdir /app/client
RUN mkdir /app/server

COPY /client/package.json /app/client
COPY /server/package.json /app/server

COPY package.json ./
COPY package-lock.json ./

WORKDIR /app/server
RUN npm install
WORKDIR /app/client
RUN npm install
WORKDIR /app
RUN npm install

# add app
COPY . /app

EXPOSE 3000
EXPOSE 3001

# start app
CMD ["npm", "run", "dev"]