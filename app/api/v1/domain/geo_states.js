/**
 * @module domain/geo_states
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
      'type',
      'name',
      'slug',
      'abbr',
      'code',
      'fips_code'
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
      type: data.type,
      name: data.name,
      slug: data.slug,
      abbr: data.abbr,
      code: data.code,
      fips_code: data.fips_code
    }
  }
}
