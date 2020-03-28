/**
 * @module domain/geo_countries
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
      'name',
      'slug',
      'abbr2',
      'abbr3',
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
      name: data.name,
      slug: data.slug,
      abbr2: data.abbr2,
      abbr3: data.abbr3,
      fips_code: data.fips_code
    }
  }
}
