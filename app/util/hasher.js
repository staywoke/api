/**
 * @module util/hasher
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const bcrypt = require('bcrypt')
const Promise = require('bluebird')

/**
 * Promise-based encryption generation and verification
 * @type {object}
 */
/* istanbul ignore next */
module.exports = {
  /**
   * Generate an encrypted string from the passed in string
   * @param  {string} str
   * @return {object} Promise object that passes a string on success
   */
  generate: (str) => {
    const hash = Promise.promisify(bcrypt.hash)
    return hash(str, 8)
  },

  /**
   * Verify an unencrypted string against an encrypted one
   * @param  {string} plainString   Unencrypted string
   * @param  {string} encodedString Encrypted string
   * @return {object} Promise object that passes a boolean
   */
  verify: (plainString, encodedString) => {
    const compare = Promise.promisify(bcrypt.compare)
    return compare(plainString, encodedString)
  }
}
