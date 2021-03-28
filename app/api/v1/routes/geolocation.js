/**
 * @module routes/geolocation
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const express = require('express')

const analytics = require('../../../analytics')
const config = require('../../../config')
const util = require('./util')

const { GeoStateDomain } = require('../domain')

const router = express.Router(config.router)

/* istanbul ignore next */
router.route('/geo/states').get((request, response) => {
  GeoStateDomain.getStates()
    .then((results) => {
      var apikey = (request.header('API-Key')) || request.query.apikey || null
      analytics.trackEvent(apikey, 'Geolocation', 'Search Results', JSON.stringify(request.query))

      response.json(util.createAPIResponse(results, request.query.fields))
    })
    .catch((error) => {
      var apikey = (request.header('API-Key')) || request.query.apikey || null
      analytics.trackEvent(apikey, 'Geolocation', 'Error', error.toString())

      response.json(util.createAPIResponse({
        errors: [error]
      }, request.query.fields))
    })
})

module.exports = router
