/**
 * @module elasticsearch/update/geo_countries
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')

const config = require('../../config')
const debug = require('../../debug')
const elasticsearchClient = require('../client')
const models = require('../../models')

const { prepareForElasticSearch } = require('../../api/v1/domain/geo_countries')

const env = config.get('env')
const indexType = `${env}_geo_countries`
const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`

/**
 * Update User Index
 */
module.exports = {
  /* istanbul ignore next */
  update () {
    elasticsearchClient.search({
      index: indexName,
      size: 0,
      body: {}
    }).then(() => {
      const params = {
        where: {}
      }

      return models.geo_countries.findAll(params)
    }).then((results) => {
      if (results.length) {
        const bulkActions = []

        _.each(results, (result) => {
          bulkActions.push({
            index: {
              _index: indexName,
              _type: indexType,
              _id: result.id
            }
          })

          const data = prepareForElasticSearch(result)

          bulkActions.push(data)
        })

        elasticsearchClient.bulk({
          body: bulkActions
        }).then((result) => {
          if (result.errors) {
            for (let i = 0; i < result.items.length; i++) {
              if (result.items[i].create && result.items[i].create.error) {
                debug.error(`Error indexing ${indexName} ${result.items[i]._id}`)
                debug.error(result.items[i].create.error)
              }
            }
          }

          debug.success(`${indexName} indexed ${result.items.length} items`)
        }).catch((error) => {
          debug.error(`Error indexing ${indexName}`)
          debug.error(`${error.status} ${error.message}`)
        })
      } else {
        debug.warn(`No new ${indexName} found`)
      }
    }).catch((error) => {
      debug.error(error)
    })
  }
}
