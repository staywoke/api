/**
 * @module elasticsearch/delete/category
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import client from './../client'
import config from '../../config'
import debug from '../../debug'

const env = config.get('env')
const indexType = `${env}_category`
const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`

/**
 * Delete Category Index
 * @type {object}
 */
export default client.indices.delete({
  index: indexName
}).then(() => {
  debug.success(`Index Deleted: ${indexName}`)
}).catch((error) => {
  debug.error(`${error.status} ${error.message}`)
})
