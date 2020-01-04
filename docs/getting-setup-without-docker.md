![StayWoke Logo](https://staywoke-github.s3.us-east-1.amazonaws.com/common/logo.png "StayWoke Logo")

**[↤ Developer Overview](../README.md)**

Getting Setup without Docker
===

Requirements
---

* [NodeJS 12.x](https://nodejs.org/en/)
* [MySQL](http://www.mysql.com/)
* [Elasticsearch 7.5.x](https://www.elastic.co/)
* [Bcrypt](http://bcrypt.sourceforge.net/)


Installing Requirements
---

#### OSX

It's recommended that you install and use [Homebrew](http://brew.sh/) for the system-level requirements for the project. Once you have it installed, you can run the following:

```bash
brew tap elastic/tap
brew tap homebrew/services
brew install node mysql bcrypt elastic/tap/elasticsearch-full
```

#### Linux

Please use the requirement links above to review install instructions for each dependency.


#### NPM Packages

```bash
npm install -g forever
```


Running the API
---

Once you have downloaded the API you will need to create some config files for the local installation.

The possible environment options are `local`, `mobile`, `staging`, `production`, `test` & `docker`.

There are two config files you will need to initial create. Using the name of the environment you wish to setup.
For example, if you are setting up a `local` environment, you would need to create `./app/config/db-local.json` & `./app/config/local.json`.

#### Example of `./app/config/local.json`

```json
{
  "debug": true,
  "env": "local",
  "secret": "F8E1577B-DDAF-8234-4DD5-9301E7223582",
  "sessionKey": "F41CF60C-9A23-55C4-DDE3-7642B13B6276",
  "debugKey": "BD52B1DC-C396-A714-B5B4-21AE9B6A0971",
  "bugsnag": "",
  "hashID": {
    "secret": "4B1AB909-EA83-4E34-3D43-280273497137"
  },
  "database": {
    "api": {
      "host": "localhost",
      "database": "local_api",
      "username": "root",
      "password": ""
    }
  },
  "mandrill": {
    "key": "CHANGE_ME"
  },
  "elasticsearch": {
    "log": "error"
  },
  "logzio": {
    "token": "CHANGE_ME",
    "type": "API"
  }
}
```

#### Example of `./app/config/db-local.json`

```json
{
  "username": "root",
  "password": "",
  "database": "local_api",
  "host": "localhost",
  "dialect": "mysql"
}
```

#### Start API

```bash
cd /path/to/api
export API_NODE_ENV=local && npm start
```

Accessing the API via Browser
---

Once the API is up and running you can access a local URL via:

```text
http://localhost:5000/v1/token?apikey=YOUR_API_KEY&pretty
```

`YOUR_API_KEY` is whatever you setup in [Downloading API](../docs/downloading-api.md)