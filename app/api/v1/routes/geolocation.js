/**
 * @module routes/geolocation
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const express = require('express')

const analytics = require('../../../analytics')
const config = require('../../../config')
const util = require('./util')

const { GeolocationDomain } = require('../domain')

const router = express.Router(config.router)

/**
 * [GET] Geolocation
 * @memberof module:routes/geolocation
 * @property {string} [city] - City to use as Filter
 * @property {string} [county] - County to use as Filter
 * @property {string} [state] - State to use as Filter
 * @property {number} [latitude] - Latitude to base Location on
 * @property {number} [longitude] - Longitude to base Location on
 * @property {string} [distance=5mi] - Distance from Latitude & Longitude ( e.g. 5mi, 10km )
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/geolocation').get((request, response) => {
  GeolocationDomain.getLocation(request.query)
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

/* istanbul ignore next */
router.route('/geo/states').get((request, response) => {
  GeolocationDomain.getStates()
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
