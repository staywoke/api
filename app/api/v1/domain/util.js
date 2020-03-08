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
   * Custom Function to Parse Boolean from CSV File
   * @param {*} val
   */
  parseBoolean (val) {
    if (typeof val === 'number') {
      if (val === 0) {
        return false
      } else if (val === 1) {
        return true
      }
    } else if (typeof val === 'string') {
      if (val.trim() === '0' || val.trim().toUpperCase() === 'N' || val.trim().toUpperCase() === 'NO') {
        return false
      } else if (val.trim() === '1' || val.trim().toUpperCase() === 'Y' || val.trim().toUpperCase() === 'YES') {
        return true
      }
    }

    return null
  },

  /**
   * Custom Function to Parse Email from CSV File
   * @param {*} val
   */
  parseEmail (val) {
    if (typeof val === 'string') {
      // eslint-disable-next-line no-useless-escape
      const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(val) ? val.toLowerCase() : null
    }

    return null
  },

  /**
   * Custom Function to Parse Float from CSV File
   * @param {*} val
   */
  parseFloat (val) {
    if (typeof val === 'number') {
      return parseFloat(val)
    } else if (typeof val === 'string') {
      return parseFloat(val.trim().replace('$', '').replace(/,/g, ''))
    }

    return null
  },

  /**
   * Custom Function to Parse Int from CSV File
   * @param {*} val
   */
  parseInt (val) {
    if (typeof val === 'number') {
      return parseInt(val)
    } else if (typeof val === 'string') {
      return parseInt(val.trim().replace('$', '').replace(/,/g, ''))
    }

    return null
  },

  /**
   * Custom Function to Parse Phone from CSV File
   * @param {*} val
   */
  parsePhone (val) {
    if (typeof val === 'string') {
      const pattern = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/
      return pattern.test(val) ? val : null
    }

    return null
  },

  /**
   * Custom Function to Parse String from CSV File
   * @param {*} val
   */
  parseString (val) {
    if (typeof val === 'number') {
      return val.toString()
    } else if (typeof val === 'string') {
      return (val.trim() !== '') ? val.trim() : null
    }

    return null
  },

  /**
   * Custom Function to Parse URL from CSV File
   * @param {*} val
   */
  parseURL (val) {
    if (typeof val === 'string') {
      try {
        // eslint-disable-next-line no-new
        new URL(val)
        return val
      } catch (_) {
        return null
      }
    }

    return null
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
   * @param stripDashes
   * @returns {string}
   */
  /* istanbul ignore next: not currently used */
  titleCase (str, stripDashes) {
    if (typeof str === 'string') {
      if (stripDashes) {
        str = str.replace(/-/g, ' ')
      }

      return str.trim().replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
    }

    return null
  }
}
