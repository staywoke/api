/**
 * @module elasticsearch/client
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const elasticsearch = require('elasticsearch')

const config = require('../config')

/**
 * Client
 * @type {object}
 */
module.exports = new elasticsearch.Client({
  host: config.get('elasticsearch.host'),
  apiVersion: config.get('elasticsearch.apiVersion'),
  requestTimeout: config.get('elasticsearch.requestTimeout'),
  log: config.get('elasticsearch.log')
})
