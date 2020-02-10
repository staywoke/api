/**
 * @module elasticsearch/create/geo_countries
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const Promise = require('bluebird')

const config = require('../../config')
const client = require('../client')
const debug = require('../../debug')

const env = config.get('env')
const indexType = `${env}_geo_countries`
const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`

/**
 * Category Mapping
 */
const mapping = {
  index: indexName,
  include_type_name: true,
  type: indexType,
  body: {}
}

/**
 * Category Mapping Body
 */
mapping.body[indexType] = {
  properties: {
    id: {
      type: 'integer'
    },
    name: {
      type: 'text'
    },
    slug: {
      type: 'text'
    },
    abbr2: {
      type: 'text'
    },
    abbr3: {
      type: 'text'
    },
    fips_code: {
      type: 'text'
    }
  }
}

/**
 * Create Category Index
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
