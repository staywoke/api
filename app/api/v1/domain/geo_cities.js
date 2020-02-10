/**
 * @module domain/geo_cities
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')

/**
 * Domain User
 * @type {object}
 */
module.exports = {
  /**
   * Prepare For API Output
   * @param {object} data - Data to be processed for API Output
   * @return {object}
   */
  prepareForAPIOutput (data) {
    const fields = [
      'country_id',
      'state_id',
      'name',
      'slug',
      'fips_state_code',
      'fips_place_code',
      'latitude',
      'longitude',
      'coordinate'
    ]

    return _.pick(data._source, fields)
  },

  /**
   * Prepare For Elastic Search
   * @param {object} data - Data to be Processed for Elastic Search
   * @return {object}
   */
  prepareForElasticSearch (data) {
    return {
      id: data.id,
      country_id: data.country_id,
      state_id: data.state_id,
      name: data.name,
      slug: data.slug,
      fips_state_code: data.fips_state_code,
      fips_place_code: data.fips_place_code,
      latitude: data.latitude,
      longitude: data.longitude,
      coordinate: data.coordinate
    }
  }
}
