/**
 * @module elasticsearch/client
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import elasticsearch from 'elasticsearch'

import config from '../config'

/**
 * Client
 * @type {object}
 */
export default new elasticsearch.Client({
  host: config.get('elasticsearch.host'),
  apiVersion: config.get('elasticsearch.apiVersion'),
  requestTimeout: config.get('elasticsearch.requestTimeout'),
  log: config.get('elasticsearch.log')
})
