/**
 * @module elasticsearch/update/tag
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import _ from 'lodash'

import config from '../../config'
import debug from '../../debug'
import elasticsearchClient from '../client'

import { TagDomain } from '../../api/v1/domain'
import { TagModel } from '../../models/api'

const env = config.get('env')
const indexType = `${env}_tag`
const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`

/**
 * Update Tag Index
 */
export default {
  update: () => {
    elasticsearchClient.search({
      index: indexName,
      size: 0,
      body: {}
    }).then(() => {
      const params = {}
      return TagModel.findAll(params)
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

          bulkActions.push(TagDomain.prepareForElasticSearch(evt))
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
