/**
 * @module elasticsearch/update/category
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')

const config = require('../../config')
const debug = require('../../debug')
const elasticsearchClient = require('../client')
const models = require('../../models')

const { prepareForElasticSearch } = require('../../api/v1/domain/category')

const env = config.get('env')
const indexType = `${env}_category`
const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`

/**
 * Update Category Index
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
        include: [{
          model: models.categories,
          as: 'subcategories'
        }],
        where: {
          parent_id: null
        },
        sort: [
          {
            parent_id: {
              order: 'asc'
            }
          }
        ]
      }

      return models.categories.findAll(params)
    }).then((categories) => {
      if (categories.length) {
        const bulkActions = []

        _.each(categories, (evt) => {
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
