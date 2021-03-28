/**
 * @module elasticsearch/delete/geo_states
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const client = require('./../client')
const config = require('../../config')
const debug = require('../../debug')

const env = config.get('env')
const indexType = `${env}_geo_states`
const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`

/**
 * Delete Category Index
 * @type {object}
 */
module.exports = client.indices.delete({
  index: indexName
}).then(() => {
  debug.success(`Index Deleted: ${indexName}`)
}).catch((error) => {
  debug.error(`${error.status} ${error.message}`)
})
