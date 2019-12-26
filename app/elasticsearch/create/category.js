/**
 * @module elasticsearch/create/category
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import Promise from 'bluebird'

import config from '../../config'
import client from '../client'
import debug from '../../debug'

const env = config.get('env')
const indexType = `${env}_category`
const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`

/**
 * Category Mapping
 * @type {{index: string, type: string, body: {}}}
 */
const mapping = {
  index: indexName,
  type: indexType,
  body: {}
}

/**
 * Category Mapping Body
 * @type {{properties: {id: {type: string}, parent_id: {type: string}, name: {type: string}, slug: {type: string}}}}
 */
mapping.body[indexType] = {
  properties: {
    id: {
      type: 'integer'
    },
    parent_id: {
      type: 'integer'
    },
    name: {
      type: 'string'
    },
    slug: {
      type: 'string'
    }
  }
}

/**
 * Create Category Index
 * @type {object}
 */
export default client.indices.exists({
  index: indexName
}).then((exists) => {
  if (!exists) {
    return client.indices.create({
      index: indexName,
      ignore: [404]
    })
  } else {
    return Promise.resolve()
  }
}).then(() => {
  client.indices.putMapping(mapping).then(() => {
    debug.success(`Index Created: ${indexName}`)
  }).catch((error) => {
    debug.error(`Error applying ${indexType} mapping`)
    debug.error(`${error.status} ${error.message}`)
  })
}).catch((error) => {
  debug.error(`There was an error creating the ${indexType} index`)
  debug.error(`${error.status} ${error.message}`)
})
