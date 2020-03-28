/**
 * @module domain/geolocation
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const GeoStateDomain = require('./geo_states')

/**
 * Domain User
 * @type {object}
 */
module.exports = {
/**
   * Get Location
   * @param {object} query - GET Parameters
   * @returns {*}
   */
  getLocation (query) {
    // @TODO: Flush Out Endpoint
    return Promise.resolve()
  },

  getStates () {
    return GeoStateDomain.getStates()
      .then((results) => {
        return Promise.resolve(results)
      }).catch((error) => {
        return Promise.reject(error)
      })
  }
}
