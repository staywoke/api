/**
 * @module routes/unauthorized
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

import express from 'express'

import config from '../../../config'
import util from './util'

const router = express.Router(config.router)

/**
 * Unauthorized
 * @memberof module:routes/unauthorized
 * @name [GET] /unauthorized
 */
/* nyc ignore next */
router.route('/unauthorized/').get((request, response) => {
  response.json(util.createAPIResponse({
    error_messages: [
      'Invalid API Request. Either your API Key is invalid, or you are accessing our API from an invalid source.'
    ]
  }, request.query.fields))
})

export default router
