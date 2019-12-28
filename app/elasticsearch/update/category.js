/**
 * @module elasticsearch/update/category
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')
const Sequelize = require('sequelize')

const config = require('../../config')
const db = require('../../config/sequelize')
const debug = require('../../debug')
const elasticsearchClient = require('../client')

const { CategoryDomain } = require('../../api/v1/domain')
const { CategoryModel } = require('../../models/api')

const env = config.get('env')
const indexType = `${env}_category`
const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`

const Category = CategoryModel(db, Sequelize)

/**
 * Update Category Index
 */
module.exports = {
  update () {
    elasticsearchClient.search({
      index: indexName,
      size: 0,
      body: {}
    }).then(() => {
      const params = {
        include: [{
          model: Category,
          as: 'subcategories'
        }],
        where: {
          parent_id: null
        },
        order: 'parent_id ASC'
      }

      return Category.findAll(params)
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

          bulkActions.push(CategoryDomain.prepareForElasticSearch(evt))
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
