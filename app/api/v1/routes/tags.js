/**
 * @module routes/tags
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

const express = require('express')
const validator = require('validator')

const config = require('../../../config')
const elasticsearchClient = require('../../../elasticsearch/client')
const util = require('./util')

const { TagDomain } = require('../domain')

const router = express.Router(config.router)

const env = config.get('env')
const indexType = `${env}_tag`
const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`

/**
 * Tags
 * @memberof module:routes/tags
 * @name [GET] /tags
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* nyc ignore next */
router.route('/tags').get((request, response) => {
  // Defaults
  let pageSize = 30
  let page = 1

  const searchParams = {
    index: indexName,
    sort: 'id',
    body: {}
  }

  // Page size
  if (request.query.pageSize && validator.isInt(request.query.pageSize) && validator.toInt(request.query.pageSize, 10) >= 1) {
    pageSize = validator.toInt(request.query.pageSize, 10)
  }

  searchParams.size = pageSize

  // Determine Page
  if (request.query.page && validator.isInt(request.query.page) && validator.toInt(request.query.page, 10) >= 1) {
    page = validator.toInt(request.query.page, 10)
  }

  searchParams.from = (page - 1) * searchParams.size

  elasticsearchClient.search(searchParams).then((result) => {
    response.json(util.createAPIResponse({
      meta: {
        total: result.hits.total,
        showing: result.hits.hits.length,
        pages: Math.ceil(result.hits.total / searchParams.size),
        page: page
      },
      data: result.hits.hits.map(TagDomain.prepareForAPIOutput)
    }, request.query.fields))
  }).catch((error) => {
    response.json(util.createAPIResponse({
      errors: [error]
    }, request.query.fields))
  })
})

module.exports = router
