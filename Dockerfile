FROM node:12.12.0-alpine
LABEL maintainer "Peter Schmalfeldt me@peterschmalfeldt.com"
LABEL version="1.0"
LABEL description="Local Development of API"
LABEL vendor="PeterSchmalfeldt"

# Add OS dependencies
RUN apk add git python make g++ bash
# Create non-root user to run app with

# RUN adduser -H /bin/bash developer
RUN addgroup -S developer && adduser -S developer -G developer -H /bin/bash/

# Set working directory

WORKDIR /home/developer/api

COPY package.json ./

RUN mkdir /home/developer/.forever
RUN chown -R developer:developer /home/developer/.forever
RUN chown -R developer:developer /home/developer/api
RUN chown -R 100:101 /home/developer/

# Change user so that everything that's npm-installed belongs to it

USER developer

RUN export API_NODE_ENV=docker

# Install dependencies
RUN npm install --no-optional

# Switch to root and copy over the rest of our code
# This is here, after the npm install, so that code changes don't trigger an un-caching
# of the npm install line

USER root

RUN npm install -g forever
RUN npm install -g sequelize-cli

COPY package.json package-lock.json ./
COPY .eslintrc.js ./
COPY .eslintignore ./
COPY .sequelizerc ./
COPY .nvmrc ./

COPY app ./app
COPY scripts ./scripts

RUN chmod 755 ./scripts/docker-compose/*.sh
RUN chown -R developer:developer /home/developer/api

USER developer
