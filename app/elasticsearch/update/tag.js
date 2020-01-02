/**
 * @module elasticsearch/update/tag
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')

const config = require('../../config')
const debug = require('../../debug')
const elasticsearchClient = require('../client')
const models = require('../../models')

const { prepareForElasticSearch } = require('../../api/v1/domain/tag')

const env = config.get('env')
const indexType = `${env}_tag`
const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`

/**
 * Update Tag Index
 */
module.exports = {
  update () {
    elasticsearchClient.search({
      index: indexName,
      size: 0,
      body: {}
    }).then(() => {
      const params = {}
      return models.tags.findAll(params)
    }).then((tags) => {
      if (tags.length) {
        const bulkActions = []

        _.each(tags, (evt) => {
          bulkActions.push({
            index: {
              _index: indexName,
              _type: indexType,
              _id: evt.id
            }
          })

          bulkActions.push(prepareForElasticSearch(evt))
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
          debug.error(`Error indexing ${indexType}`)
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
