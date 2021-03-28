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
 */
const mapping = {
  index: indexName,
  type: indexType,
  include_type_name: true,
  body: {
    properties: {
      activated: {
        type: 'boolean'
      },
      username: {
        type: 'text'
      },
      first_name: {
        type: 'text'
      },
      last_name: {
        type: 'text'
      },
      company_name: {
        type: 'text'
      },
      profile_name: {
        type: 'text'
      },
      location: {
        type: 'text'
      },
      profile_link_website: {
        type: 'text'
      },
      profile_link_twitter: {
        type: 'text'
      },
      profile_link_1: {
        type: 'text'
      },
      profile_link_2: {
        type: 'text'
      },
      profile_link_3: {
        type: 'text'
      },
      banned: {
        type: 'boolean'
      }
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
    debug.error(`Error applying ${indexType} mapping:`)
    debug.error(`${error.status} ${error.message}\n`)
  })
}).catch((error) => {
  debug.error(`There was an error creating the ${indexType} index`)
  debug.error(`${error.status} ${error.message}`)
})
