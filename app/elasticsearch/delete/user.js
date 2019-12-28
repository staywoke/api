/**
 * @module elasticsearch/delete/user
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const client = require('./../client')
const config = require('../../config')
const debug = require('../../debug')

const env = config.get('env')
const indexType = `${env}_user`
const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`

/**
 * Delete User Index
 * @type {object}
 */
module.exports = client.indices.delete({
  index: indexName
}).then(() => {
  debug.success(`Index Deleted: ${indexName}`)
}).catch((error) => {
  debug.error(`${error.status} ${error.message}`)
})
