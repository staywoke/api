/**
 * @module routes/token
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

const express = require('express')

const config = require('../../../config')
const util = require('./util')

const { UsersAuthDomain } = require('../domain')

const router = express.Router(config.router)

/**
 * Token
 * @memberof module:routes/token
 * @name [GET] /token
 */
/* istanbul ignore next */
router.route('/token').get((request, response) => {
  const ipAddress = request.headers['x-forwarded-for']
  const token = UsersAuthDomain.createWebsiteToken(ipAddress)

  response.json(util.createAPIResponse({
    data: {
      token: token
    }
  }, request.query.fields))
})

module.exports = router
