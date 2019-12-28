#!/usr/bin/env node

/**
 * @module server
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const bodyParser = require('body-parser')
const Debug = require('debug')
const dotenv = require('dotenv')
const express = require('express')
const rateLimit = require('express-rate-limit')
const Sequelize = require('sequelize')
const session = require('express-session')
const uuid = require('uuid')

const analytics = require('./analytics')
const config = require('./config')
const db = require('./config/sequelize')
const router = require('./router')
const routerUtil = require('./api/v1/routes/util')

const { ApiAuthenticationModel } = require('./models/api')

// Import Environment before Remaining Imports
dotenv.config({
  silent: true
})

const ApiAuthentication = ApiAuthenticationModel(db, Sequelize)
const app = express()
const debug = Debug('express:api')

const apiLimit = {
  delayAfter: 0,
  delayMs: 0,
  windowMs: 24 * 60 * 60 * 1000,
  max: 2500
}

let limiter = rateLimit(apiLimit)
const apiUser = {}

process.title = 'api'

/* nyc ignore next */
const SetupAPI = (request, response, next) => {
  if ('pretty' in request.query && request.query.pretty !== 'false') {
    app.set('json spaces', 2)
  }

  let host = request.headers.origin
  const acceptedMethods = ['OPTIONS']

  if (request.header('API-Key')) {
    request.query.apikey = request.header('API-Key')
  }

  if (request.headers.host) {
    apiUser.host = request.headers.host
  }

  if (request.query.apikey) {
    analytics.trackEvent(request.query.apikey, 'API Key', request.query.apikey, request.url)

    return ApiAuthentication.findOne({
      where: {
        api_key: request.query.apikey
      }
    }).then((user) => {
      if (user) {
        const settings = user.dataValues

        if (settings.allow_api_get) {
          acceptedMethods.push('GET')
        }

        if (settings.allow_api_post) {
          acceptedMethods.push('POST')
        }

        if (settings.allow_api_put) {
          acceptedMethods.push('PUT')
        }

        if (settings.allow_api_delete) {
          acceptedMethods.push('DELETE')
        }

        // Allow OPTIONS from all hosts
        if (request.method === 'OPTIONS') {
          host = '*'
        }

        response.setHeader('X-Powered-By', 'API')
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.setHeader('Access-Control-Allow-Headers', 'Accept, Access-Control-Allow-Methods, Authorization, Content-Type, X-Powered-By')
        response.setHeader('Access-Control-Allow-Methods', acceptedMethods.join(', '))

        if (host) {
          response.setHeader('Access-Control-Allow-Origin', host)
        }

        if (!settings.allow_api_get && request.method === 'GET') {
          analytics.trackEvent(request.query.apikey, request.method, 'Request Denied', request.url)
          return response.status(403).end(JSON.stringify(routerUtil.createAPIResponse({
            errors: ['API Key does not support GET Requests']
          })))
        }

        if (!settings.allow_api_post && request.method === 'POST') {
          analytics.trackEvent(request.query.apikey, request.method, 'Request Denied', request.url)

          return response.status(403).end(JSON.stringify(routerUtil.createAPIResponse({
            errors: ['API Key does not support POST Requests']
          })))
        }

        if (!settings.allow_api_put && request.method === 'PUT') {
          analytics.trackEvent(request.query.apikey, request.method, 'Request Denied', request.url)

          return response.status(403).end(JSON.stringify(routerUtil.createAPIResponse({
            errors: ['API Key does not support PUT Requests']
          })))
        }

        if (!settings.allow_api_delete && request.method === 'DELETE') {
          analytics.trackEvent(request.query.apikey, request.method, 'Request Denied', request.url)
          return response.status(403).end(JSON.stringify(routerUtil.createAPIResponse({
            errors: ['API Key does not support DELETE Requests']
          })))
        }

        // Check for approved host
        if (settings.approved_whitelist && settings.approved_whitelist !== '*') {
          const whitelist = settings.approved_whitelist.split(',')
          let validHost = false

          for (let i = 0; i < whitelist.length; i++) {
            if (whitelist.indexOf(apiUser.host) !== -1) {
              validHost = true
              break
            }
          }

          if (!validHost) {
            analytics.trackEvent(request.query.apikey, 'Invalid Host', apiUser.host, request.url)
            return response.status(401).send(JSON.stringify(routerUtil.createAPIResponse({
              errors: ['Invalid Host for API Key']
            })))
          }
        }

        // Set API Limits
        apiLimit.max = (!isNaN(settings.daily_limit)) ? (parseInt(settings.daily_limit, 10)) : 1000
        limiter = rateLimit(apiLimit)

        next()
      } else {
        analytics.trackEvent(request.query.apikey, request.method, 'Invalid API Key', request.url)
        return response.status(401).end(JSON.stringify(routerUtil.createAPIResponse({
          errors: ['Invalid API Key']
        })))
      }
    }).catch((err) => {
      analytics.trackEvent(request.query.apikey, request.method, 'Invalid API Authentication', request.url)
      return response.status(401).end(JSON.stringify(routerUtil.createAPIResponse({
        errors: ['Invalid API Authentication', err]
      })))
    })
  } else {
    analytics.trackEvent(request.query.apikey, request.method, 'Missing API Key', request.url)
    return response.status(401).end(JSON.stringify(routerUtil.createAPIResponse({
      errors: ['Missing API Key']
    })))
  }
}

app.enable('trust proxy')

/**
 * Allow for Timeout JSON Response
 */
/* nyc ignore next */
app.use((req, res, next) => {
  res.setTimeout(5000, () => {
    if (req.header('API-Key')) {
      req.query.apikey = req.header('API-Key')
    }
    analytics.trackEvent(req.query.apikey, 'Error', 'Request Timed Out', req.url)
    res.status(408).end(JSON.stringify(routerUtil.createAPIResponse({
      errors: ['Request Timed Out']
    })))
  })

  next()
})

/* nyc ignore next */
app.use(session({
  genid: () => {
    return uuid.v4()
  },
  secret: config.get('sessionKey'),
  resave: true,
  saveUninitialized: true
}))

app.use('/', express.static(`${__dirname}/static`))
app.use('/assets', express.static(`${__dirname}/static/assets`))
app.use('/index.html', express.static(`${__dirname}/static/index.html`))
app.use('/favicon.ico', express.static(`${__dirname}/static/favicon.ico`))
app.use('/robots.txt', express.static(`${__dirname}/static/robots.txt`))
app.use('/humans.txt', express.static(`${__dirname}/static/humans.txt`))
app.use('/docs.js', express.static(`${__dirname}/static/docs.js`))
app.use('/docs.css', express.static(`${__dirname}/static/docs.css`))
app.use('/docs', express.static(`${__dirname}/static/docs`))
app.use('/guide', express.static(`${__dirname}/static/guide`))
app.use('/.well-known', express.static(`${__dirname}/.well-known`))

app.use(SetupAPI)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(limiter)
app.use(router)

// Fallback for Possible Routes used that do not exist
/* nyc ignore next */
app.get('*', (req, res) => {
  if (req.header('API-Key')) {
    req.query.apikey = req.header('API-Key')
  }

  analytics.trackEvent(req.query.apikey, req.method, 'Invalid URL', req.url)
  res.status(404).end(JSON.stringify(routerUtil.createAPIResponse({
    errors: [
      'The API Endpoint you are trying to access does not exist.',
      'Please view our Documentation for API Usage Instructions.',
      'http://docs.staywoke.apiary.io'
    ]
  })))
})

/**
 * Event listener for HTTP server "error" event.
 */
/* nyc ignore next */
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const port = config.get('port')
  const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
/* nyc ignore next */
const onListening = () => {
  const addr = app.address()
  const bind = (typeof addr === 'string') ? 'pipe ' + addr : 'port ' + addr.port
  debug(`Listening on ${bind}`)
}

app.on('error', onError)
app.on('listening', onListening)

module.exports = app.listen(config.get('port'))
module.exports.setupAPI = SetupAPI
