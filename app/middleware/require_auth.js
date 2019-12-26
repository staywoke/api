/**
 * @module middlewear/require_auth
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import jwt from 'express-jwt'

import config from '../config'

/**
 * Require Auth
 * @type {object}
 */
export default jwt({
  secret: config.get('secret')
})
