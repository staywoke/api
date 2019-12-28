FROM node:12.12.0
LABEL maintainer "Peter Schmalfeldt me@peterschmalfeldt.com"
LABEL version="1.0"
LABEL description="Local Development of API"
LABEL vendor="PeterSchmalfeldt"

# Create non-root user to run app with

RUN useradd --user-group --create-home --shell /bin/bash developer

# Set working directory

WORKDIR /home/developer/api

COPY package.json ./

RUN mkdir /home/developer/.forever
RUN chown -R developer:developer /home/developer/.forever
RUN chown -R developer:developer /home/developer/api

# Change user so that everything that's npm-installed belongs to it

USER developer

RUN export API_NODE_ENV=docker

# Install dependencies
RUN npm install --no-optional && npm cache clean

# Switch to root and copy over the rest of our code
# This is here, after the npm install, so that code changes don't trigger an un-caching
# of the npm install line

USER root

RUN npm install -g forever
RUN npm install -g sequelize-cli

COPY .eslint.js ./
COPY .eslintignore ./
COPY .sequelizerc ./
COPY .env ./
COPY .nvmrc ./

COPY app ./app
COPY scripts ./scripts

# Download Required Libraries
RUN rm -f ./app/flat-db/cities.mmdb
RUN curl -o ./app/flat-db/cities.mmdb.gz http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz
RUN gunzip ./app/flat-db/cities.mmdb.gz

RUN rm -f ./app/flat-db/countries.mmdb
RUN curl -o ./app/flat-db/countries.mmdb.gz http://geolite.maxmind.com/download/geoip/database/GeoLite2-Country.mmdb.gz
RUN gunzip ./app/flat-db/countries.mmdb.gz

RUN chmod 755 ./scripts/docker-compose/*.sh
RUN chown -R developer:developer /home/developer/api

USER developer
