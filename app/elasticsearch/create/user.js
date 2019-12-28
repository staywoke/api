/**
 * @module elasticsearch/create/user
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const Promise = require('bluebird')

const client = require('../client')
const config = require('../../config')
const debug = require('../../debug')

const env = config.get('env')
const indexType = `${env}_user`
const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`

/**
 * User Mapping
 * @type {{index: string, type: string, body: {}}}
 */
const mapping = {
  index: indexName,
  type: indexType,
  body: {}
}

/**
 * User Mapping Body
 * @type {{properties: {activated: {type: string}, username: {type: string}, first_name: {type: string}, last_name: {type: string}, company_name: {type: string}, profile_name: {type: string}, location: {type: string}, profile_link_website: {type: string}, profile_link_twitter: {type: string}, profile_link_1: {type: string}, profile_link_2: {type: string}, profile_link_3: {type: string}, banned: {type: string}}}}
 */
mapping.body[indexType] = {
  properties: {
    activated: {
      type: 'boolean'
    },
    username: {
      type: 'string'
    },
    first_name: {
      type: 'string'
    },
    last_name: {
      type: 'string'
    },
    company_name: {
      type: 'string'
    },
    profile_name: {
      type: 'string'
    },
    location: {
      type: 'string'
    },
    profile_link_website: {
      type: 'string'
    },
    profile_link_twitter: {
      type: 'string'
    },
    profile_link_1: {
      type: 'string'
    },
    profile_link_2: {
      type: 'string'
    },
    profile_link_3: {
      type: 'string'
    },
    banned: {
      type: 'boolean'
    }
  }
}

/**
 * Create User Index
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
