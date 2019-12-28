/**
 * @module routes/categories
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

const express = require('express')
const validator = require('validator')

const analytics = require('../../../analytics')
const config = require('../../../config')
const elasticsearchClient = require('../../../elasticsearch/client')
const util = require('./util')

const { CategoryDomain } = require('../domain')

const env = config.get('env')
const indexType = `${env}_category`
const indexName = `${config.get('elasticsearch.indexName')}_${indexType}`
const router = express.Router(config.router)

/**
 * [GET] Categories
 * @memberof module:routes/categories
 * @name /categories/:slug?
 * @property {string} [slug] - Specific Category Slug
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* nyc ignore next */
router.route('/categories/:slug?').get((request, response) => {
  // Defaults
  let pageSize = 30
  let page = 1

  const searchParams = {
    index: indexName,
    sort: 'id',
    body: {},
    where: {
      parent_id: null
    }
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

  if (request.params.slug) {
    searchParams.body = {
      query: {
        match: {
          slug: request.params.slug
        }
      }
    }
  }

  elasticsearchClient.search(searchParams).then((result) => {
    const apikey = (request.header('API-Key')) || request.query.apikey || null
    analytics.trackEvent(apikey, 'Categories', 'Results', 'Params: ' + JSON.stringify(request.params), result.hits.total)

    response.json(util.createAPIResponse({
      meta: {
        total: result.hits.total,
        showing: result.hits.hits.length,
        pages: Math.ceil(result.hits.total / searchParams.size),
        page: page
      },
      data: result.hits.hits.map(CategoryDomain.prepareForAPIOutput)
    }))
  }).catch((error) => {
    const apikey = (request.header('API-Key')) || request.query.apikey || null
    analytics.trackEvent(apikey, 'Categories', 'Error', error.toString())

    response.json(util.createAPIResponse({
      errors: [error]
    }, request.query.fields))
  })
})

module.exports = router
