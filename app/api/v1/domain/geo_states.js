/**
 * @module domain/geo_states
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')

const config = require('../../../config')
const elasticsearchClient = require('../../../elasticsearch/client')

const env = config.get('env')
const indexType = `${env}_geo_states`
const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`

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
      'abbr'
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
  },

  getStates () {
    const self = this
    const searchParams = {
      index: indexName,
      type: indexType,
      size: 100,
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  type: 'state'
                }
              }
            ]
          }
        },
        sort: {
          name: {
            order: 'asc'
          }
        }
      }
    }

    return elasticsearchClient.search(searchParams)
      .then((result) => {
        const data = result.hits.hits.map(self.prepareForAPIOutput)
        return {
          data: data
        }
      })
      .catch((error) => {
        return {
          errors: [error],
          data: null
        }
      })
  }
}
