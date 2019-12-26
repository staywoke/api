/**
 * @module domain/users/local_auth_strategy
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import Sequelize from 'sequelize'
import { Strategy as LocalStrategy } from 'passport-local'

import db from '../../../../config/sequelize'
import hasher from '../../../../util/hasher'
import { UserModel } from '../../../../models/api'

const User = UserModel(db, Sequelize)

/**
 * Local Auth Strategy
 * @type {object}
 */
export default new LocalStrategy(
  /**
   * @name Local Authentication Strategy
   * @property {string} username - Username for Login
   * @property {string} password - Password for Login
   * @property {callback} cb - Requested Callback Handler
   */
  (username, password, cb) => {
    User.findOne({
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
