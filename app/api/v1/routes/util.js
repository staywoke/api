/**
 * @module routes/util
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')
const jwt = require('jsonwebtoken')
const request = require('request')

const config = require('../../../config')
const models = require('../../../models')

/* nyc ignore next */
module.exports = {

  /**
   * Default Response Template
   */
  defaultResponse: {
    notices: [],
    warnings: [],
    errors: [],
    field_errors: {},
    meta: {
      total: 0,
      showing: 0,
      pages: 1,
      page: 1
    },
    data: null
  },

  /**
   * Extend `defaultResponse` with the passed in object, pass the result into `response.json()`
   * @param  {object} data - Data object to fill response with
   * @param {string} [fields] - Comma Separated List of fields you want in the response
   * @return {object}
   */
  createAPIResponse: (data, fields) => {
    const filters = (fields) ? fields.split(',') : []
    const filterData = (data) => {
      return _.omitBy(data, (value, key) => {
        return (filters.indexOf(key) === -1)
      })
    }

    if (data && typeof data.data !== 'undefined' && filters.length > 0) {
      if (Array.isArray(data.data)) {
        const filteredData = []
        for (let i = 0; i < data.data.length; i++) {
          const filtered = filterData(data.data[i])

          filteredData.push(filtered)
        }

        data.data = filteredData
      } else {
        data.data = _.omitBy(data.data, (value, key) => {
          return (filters.indexOf(key) === -1)
        })
      }
    }

    const response = _.merge({}, this.defaultResponse, data)

    const errors = _.map(response.field_errors, (value, key) => {
      return _.isArray(value) && value.length > 0
    })

    if (errors && errors.length > 0 && typeof response.errors === 'undefined') {
      response.errors = []
    }

    if (errors && errors.length > 0) {
      response.errors = errors
    }


    // Sort Data if a single object
    if (data && !_.isArray(data.data) && _.isObject(data.data)) {
      const sortedData = {}
      Object.keys(data.data).sort().forEach((key) => {
        sortedData[key] = data.data[key]
      })

      response.data = sortedData
    }

    // Auto populate meta data if not was sent over
    if (data && !data.meta) {
      let total = 1

      if (_.isEmpty(data.data)) {
        total = 0
      } else if (_.isArray(data.data)) {
        total = data.data.length
      }

      if (typeof response.meta === 'undefined') {
        response.meta = {}
      }

      response.meta.total = total
      response.meta.showing = total
      response.meta.pages = 1
      response.meta.page = 1
    }

    if (!response.error) {
      response.attribution = {
        text: 'Data Provided by StayWoke',
        website: 'https://staywoke.org',
        link: '<a href="https://staywoke.org">Data Provided by StayWoke</a>',
        license: 'https://raw.githubusercontent.com/staywoke/api/master/LICENSE',
        report_bug: 'https://github.com/staywoke/api/issues/new',
        logo: 'https://cdn.staywoke.org/common/logo.png',
        icon: 'https://cdn.staywoke.org/common/icon.png'
      }
    }

    return response
  },

  /**
   * Make Remote HTTP call to {@link http://ipinfodb.com/ip_location_api.php} API to convert IP Address to Geoocation
   * @param {string} ip - IP Address
   * @param {callback} callback - Requested Callback Handler
   */
  getGeoLocation: (ip, callback) => {
    const params = {
      key: config.get('ipinfodb.key'),
      ip: ip,
      format: 'json'
    }

    request.get({
      url: 'https://api.ipinfodb.com/v3/ip-city/',
      qs: params
    }, (error, response, geolocation) => {
      if (error) {
        return callback(new Error(error))
      }

      if (geolocation && typeof geolocation === 'string') {
        callback(JSON.parse(geolocation))
      } else {
        const defaultResponse = {
          statusCode: 'OK',
          statusMessage: '',
          ipAddress: ip,
          countryCode: null,
          countryName: null,
          regionName: null,
          cityName: null,
          zipCode: null,
          latitude: null,
          longitude: null,
          timeZone: null
        }

        callback(defaultResponse)
      }
    })
  },

  /**
   * Track User Login
   * @param {object} user - User Object
   * @param {object} request - Node HTTP Request
   */
  trackLogin: (user, request) => {
    const ipAddress = request.headers['x-forwarded-for']
    const userAgent = request.headers['user-agent']

    this.getGeoLocation(ipAddress, (geolocation) => {
      if (geolocation) {
        models.user_login.create({
          user_id: user.get('id'),
          user_agent: userAgent,
          ip_address: geolocation.ipAddress,
          country: geolocation.countryCode,
          city: geolocation.cityName,
          state: geolocation.regionName,
          postal_code: geolocation.zipCode,
          latitude: geolocation.latitude,
          longitude: geolocation.longitude
        })
      }
    })
  },

  /**
   * Track User Activity
   * @param {number} user_id - Logged In User ID
   * @param {string} type - Type of User Activity
   * @param {object} data - Data to Track
   * @param {callback} callback - Requested Callback Handler
   * @returns {*}
   */
  trackActivity: (userId, type, data, callback) => {
    if (userId && type) {
      const log = {
        user_id: userId,
        type: type
      }

      if (data && data.follow_user_id) {
        log.follow_user_id = data.follow_user_id
      }

      models.user_activity.create(log)
    }

    if (typeof callback === 'function') {
      return callback()
    }
  },

  /**
   * Check if User is Valid
   * @param {object} request - HTTP Request
   * @param {callback} callback - Requested Callback Handler
   * @returns {*}
   */
  isValidUser: (request, callback) => {
    const headerToken = (request.headers.authorization) ? request.headers.authorization.replace('Bearer ', '') : null

    if (headerToken && headerToken !== null) {
      jwt.verify(headerToken, config.get('secret'), (err, decoded) => {
        if (err) {
          return callback(new Error(err))
        }

        if (decoded.userId) {
          return callback(parseInt(decoded.userId, 10))
        } else {
          return callback()
        }
      })
    } else {
      return callback(new Error('Missing Header Token'))
    }
  },

  /**
   * Convert String to Title Case
   * @param str
   * @returns {string}
   */
  titleCase: (str) => {
    return str.trim().replace(/-/g, ' ').replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  }
}
