/**
 * @module routes/token
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

import express from 'express'

import config from '../../../config'
import util from './util'

import { UsersAuthDomain } from '../domain'

const router = express.Router(config.router)

/**
 * Token
 * @memberof module:routes/token
 * @name [GET] /token
 */
/* nyc ignore next */
router.route('/token').get((request, response) => {
  const ipAddress = request.headers['x-forwarded-for']
  const token = UsersAuthDomain.createWebsiteToken(ipAddress)

  response.json(util.createAPIResponse({
    data: {
      token: token
    }
  }, request.query.fields))
})

export default router
