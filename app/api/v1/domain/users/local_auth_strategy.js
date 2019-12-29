/**
 * @module domain/users/local_auth_strategy
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const Strategy = require('passport-local').Strategy

const hasher = require('../../../../util/hasher')
const models = require('../../../../models')

/**
 * Local Auth Strategy
 * @type {object}
 */
module.exports = new Strategy(
  /**
   * @name Local Authentication Strategy
   * @property {string} username - Username for Login
   * @property {string} password - Password for Login
   * @property {callback} cb - Requested Callback Handler
   */
  (username, password, cb) => {
    models.users.findOne({
      where: {
        username: username.toLowerCase()
      }
    }).then((user) => {
      if (!user) {
        return cb('Incorrect Username')
      }

      if (!user.isActive()) {
        return cb('Account is Either Inactive of Banned')
      }

      hasher.verify(password, user.password).then((isValid) => {
        if (isValid === true) {
          return cb(null, user)
        } else {
          return cb('Incorrect Password')
        }
      })
    }).catch(cb)
  }
)
