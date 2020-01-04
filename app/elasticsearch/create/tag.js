/**
 * @module elasticsearch/create/tag
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const Promise = require('bluebird')

const config = require('../../config')
const client = require('../client')
const debug = require('../../debug')

const env = config.get('env')
const indexType = `${env}_tag`
const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`

/**
 * Tag Mapping
 * @type {{index: string, type: string, body: {}}}
 */
const mapping = {
  index: indexName,
  type: indexType,
  body: {}
}

/**
 * Tag Mapping Body
 * @type {{properties: {id: {type: string}, parent_id: {type: string}, name: {type: string}, slug: {type: string}}}}
 */
mapping.body[indexType] = {
  properties: {
    name: {
      type: 'string'
    },
    slug: {
      type: 'string'
    }
  }
}

/**
 * Create Tag Index
 * @type {object}
 */
module.exports = client.indices.exists({
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
