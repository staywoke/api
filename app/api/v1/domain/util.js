/**
 * @module domain/util
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const _ = require('lodash')

/**
 * Doing domain utilities
 * @type {Object}
 */
module.exports = {
  /**
   * Takes a string of comma-separated numbers, e.g. "1,5,7", splits by comma and returns an array of integers, pruning out anything that's not an integer
   * @param  {string} str Comma-separated numbers
   * @return {array}
   */
  normalizeCommaSeparatedIntegers (str) {
    const ints = _.compact(_.map(str.split(','), (raw) => {
      const num = parseInt(_.trim(raw), 10)
      /* istanbul ignore else */
      if (_.isNumber(num)) {
        return num
      } else {
        return null
      }
    }))

    return ints && ints.length ? ints : null
  },

  /**
   * Sort Object by Keys
   * @param obj
   * @returns {Object}
   */
  sortByKeys (obj) {
    const keys = Object.keys(obj)
    const sortedKeys = _.sortBy(keys)

    return _.fromPairs(
      _.map(
        sortedKeys,
        (key) => {
          return [key, obj[key]]
        }
      )
    )
  },

  /**
   * Convert String to Title Case
   * @param str
   * @returns {string}
   */
  /* istanbul ignore next: not currently used */
  titleCase (str) {
    return str.trim().replace(/-/g, ' ').replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  }
}
